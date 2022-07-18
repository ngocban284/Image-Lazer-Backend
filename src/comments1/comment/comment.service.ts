import { Post } from './../../posts/entities/post.entity';
import { ChatService } from './../../chat/chat.service';
import { User } from './../../users/entities/user.entity';
import {
  ImageComments,
  ImageCommentsDocument,
} from './../imageComments/entities/imageComments.entity';
import { DirectCommentDto } from './dto/direct-comment.dto';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Comment1, CommentDocument } from './entities/comment.entity';
import { Model } from 'mongoose';
import { DirectCommentHistoryDto } from './dto/direct-comment-history.dto';
import { DirectNotificationCommentDto } from './dto/direct-notification-comment.dto';
@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentService {
  @WebSocketServer() server: Server;

  constructor(
    @InjectModel(Comment1.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(ImageComments.name)
    private readonly imageCommentsModel: Model<ImageCommentsDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly chatService: ChatService,
  ) {}

  directCommentHandler = async (client: Socket, data: DirectCommentDto) => {
    try {
      const { user_id: userId } = client.data.user;
      const { imageId, content, parentCommentId } = data;
      const comment = await this.commentModel.create({
        author: userId,
        content: content,
        parentCommentId,
      });

      const imageComment = await this.imageCommentsModel.findOne({
        imageId: imageId,
      });

      if (imageComment) {
        imageComment.comments.push(comment._id);
        await imageComment.save();
        // update comment history
        this.updateCommentHistory(imageComment._id.toString());
      } else {
        const newImageComment = await this.imageCommentsModel.create({
          imageId: imageId,
          comments: [comment._id],
        });
        await newImageComment.save();
        // update comment history
        this.updateCommentHistory(newImageComment._id.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  directCommentHistoryHandler = async (data: DirectCommentHistoryDto) => {
    try {
      const imageId = data;

      if (imageId) {
        const imageComment = await this.imageCommentsModel.findOne({
          imageId: imageId,
        });

        if (imageComment) {
          // update comment history
          this.updateCommentHistory(imageComment._id.toString());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateCommentHistory = async (imageCommentsId: string) => {
    const imageComment = await this.imageCommentsModel.findById(imageCommentsId).populate({
      path: 'comments',
      model: Comment1.name,
      populate: [
        {
          path: 'author',
          model: User.name,
          select: 'email userName _id avatar fullName',
        },
        {
          path: 'likes',
          model: User.name,
          select: 'userName _id',
        },
      ],
    });

    if (imageComment) {
      return this.server.emit('directCommentHistory', {
        comments: imageComment.comments,
        imageId: imageComment.imageId,
      });
    }
  };

  usersCommentedImage = async (imageId: string) => {
    const users = new Set();
    const commentedImage = await this.imageCommentsModel.findOne({ imageId: imageId }).populate({
      path: 'comments',
      model: Comment1.name,
      select: 'author',
      populate: {
        path: 'author',
        model: User.name,
        select: 'userName _id',
      },
    });
    const userImage = await this.postModel.findOne({ _id: imageId });
    const {user_id} = userImage;

    if (commentedImage) {
      users.add(user_id);
      commentedImage.comments.forEach(comment => {
        users.add(comment['author']._id);
      });
    }
    const usersCommented = Array.from(users);
    return usersCommented;
  };

  directNotificationComment = async (client: Socket, data: DirectNotificationCommentDto) => {
    const { user_id: userId } = client.data.user;

    const imageId = data.toString();

    const usersCommented = await this.usersCommentedImage(imageId);
    const otherUsers = usersCommented.filter(user => user.toString() !== userId.toString());
    const receiverUsers = await this.userModel.find({
      _id: { $in: otherUsers },
    });
    // console.log(receiverUsers);
    if (receiverUsers && imageId !== '' && userId) {
      const { userName } = await this.userModel.findById(userId);
      receiverUsers.forEach(async user => {
        const userComment = user.markNotificationAsUnread.comments.find(comment => comment.imageId === imageId && comment.userName === userName);
        if (!userComment) {
          const newMarkCommentAsUnread = [...user.markNotificationAsUnread.comments, { userName, imageId, date: new Date() }];
          await this.userModel.findByIdAndUpdate(user._id, {
            markNotificationAsUnread: {
              likes: user.markNotificationAsUnread.likes,
              comments: newMarkCommentAsUnread,
            },
          });
          otherUsers.forEach((userId: string) => {
            const clientId = this.chatService.getActiveConnectionOfUser(userId.toString());
            this.server.to(clientId).emit('notification');
          });
        }
      });
    }
  };

  deleteNotification = async (client: Socket) => {
    const { user_id: userId } = client.data.user;

    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user.markNotificationAsUnread.comments.length > 0) {
        await this.userModel.findByIdAndUpdate(userId, {
          markNotificationAsUnread: {
            likes: [],
            comments: [],
          },
        });
      }
      const clientId = this.chatService.getActiveConnectionOfUser(userId);
      this.server.to(clientId).emit('notification');
    }
  };
}

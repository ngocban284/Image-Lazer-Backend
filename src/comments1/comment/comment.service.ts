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
    const imageComment = await this.imageCommentsModel
      .findById(imageCommentsId)
      .populate({
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
}

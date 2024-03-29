import { ChatService } from './../chat.service';
import { ChatGateway } from './../chat.gateway';
import { DirectChatHistoryDto } from './dto/direct-chat-history.dto';
import { DirectMessageDto } from './dto/direct-message.dto';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import mongoose, { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from '../conversation/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import { DirectNotificationMessageDto } from './dto/direct-notification-message.dto';
import * as _ from 'lodash';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageService {
  @WebSocketServer() server: Server;

  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly chatGateway: ChatGateway,
    private readonly chatService: ChatService,
  ) {}

  directMessageHandler = async (client: Socket, data: DirectMessageDto) => {
    try {
      // console.log('direct message event is being handler');

      const { user_id: userId } = client.data.user;
      // console.log(userId);

      const { receiverUserId, content } = data;

      // create new message
      const message = await this.messageModel.create({
        content: content,
        author: userId,
        data: new Date(),
      });

      // find if conversation exist with this two users - if not create new
      const conversation = await this.conversationModel.findOne({
        participants: { $all: [userId, receiverUserId] },
      });

      if (conversation) {
        conversation.messages.push(message._id);
        await conversation.save();

        // chat update, update chat history
        this.updateChatHistory(conversation._id.toString());
      } else {
        // create new conversation if not exists
        const newConversation = await this.conversationModel.create({
          messages: [message._id],
          participants: [userId, receiverUserId],
        });

        // chat update, update chat history
        this.updateChatHistory(newConversation._id.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  directChatHistoryHandler = async (
    client: Socket,
    data: DirectChatHistoryDto,
  ) => {
    try {
      const { user_id } = client.data.user;
      const receiverUserId = data.toString();

      if (user_id && receiverUserId) {
        const conversation = await this.conversationModel.findOne({
          participants: { $all: [user_id, receiverUserId] },
        });

        if (conversation) {
          // update chat history
          this.updateChatHistory(conversation._id.toString(), client.id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateChatHistory = async (
    conversationId: string,
    toSpecifiedSocketId = null,
  ) => {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .populate({
        path: 'messages',
        model: Message.name,
        populate: {
          path: 'author',
          model: User.name,
          select: 'email _id',
        },
      });

    if (conversation) {
      const io = this.chatGateway.getSocketServerInstance();

      if (toSpecifiedSocketId) {
        return io.to(toSpecifiedSocketId).emit('directChatHistory', {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      }

      conversation.participants.forEach((userId) => {
        const activeConnections = this.chatService.getActiveConnections(
          userId.toString(),
        );

        activeConnections.forEach((clientId) => {
          io.to(clientId).emit('directChatHistory', {
            messages: conversation.messages,
            participants: conversation.participants,
          });
        });
      });
    }
  };

  directNotificationMessage = async (
    client: Socket,
    data: DirectNotificationMessageDto,
  ) => {
    const { user_id: userId } = client.data.user;

    const receiverUserId = data.toString();

    const receiverUser = await this.userModel.findById(receiverUserId);
    if (!receiverUser.markMessageAsUnread.includes(userId)) {
      receiverUser.markMessageAsUnread.push(userId);
      await receiverUser.save();
      const clientId =
        this.chatService.getActiveConnectionOfUser(receiverUserId);
      return this.server.to(clientId).emit('notification');
    }
  };

  deleteNotificationMessage = async (
    client: Socket,
    data: DirectNotificationMessageDto,
  ) => {
    const { user_id: userId } = client.data.user;

    const receiverUserId = data.toString();

    if (receiverUserId !== '') {
      const user = await this.userModel.findById(userId);
      const receiverId = new mongoose.Types.ObjectId(receiverUserId);
      if (user.markMessageAsUnread.includes(receiverId)) {
        const newMarkMessageAsUnread = user.markMessageAsUnread.filter(
          (id) => id.toString() !== receiverId.toString(),
        );
        await this.userModel.findByIdAndUpdate(userId, {
          markMessageAsUnread: newMarkMessageAsUnread,
        });
      }
    }
  };
}

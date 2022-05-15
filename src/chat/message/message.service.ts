import { DirectChatHistoryDto } from './dto/direct-chat-history.dto';
import { DirectMessageDto } from './dto/direct-message.dto';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from '../conversation/entities/conversation.entity';

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
  ) {}

  directMessageHandler = async (client: Socket, data: DirectMessageDto) => {
    try {
      console.log('direct message event is being handler');

      const { user_id: userId } = client.data.user;

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

        //TODO: chat update, update chat history
      } else {
        // create new conversation if not exists
        const newConversation = await this.conversationModel.create({
          messages: [message._id],
          participants: [userId, receiverUserId],
        });

        //TODO: chat update, update chat history
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
      const { userId } = client.data.user;
      const { receiverUserId } = data;

      const conversation = await this.conversationModel.findOne({
        participants: { $all: [userId, receiverUserId] },
      });

      if (conversation) {
        //TODO: update chat history
      }
    } catch (error) {
      console.log(error);
    }
  };
}

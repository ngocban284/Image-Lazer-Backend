/* eslint-disable @typescript-eslint/no-unused-vars */
import { UpdateReceiverConversationDto } from './dto/updateReceiverConversation.dto';
import { Socket } from 'socket.io';
import {
  Conversation,
  ConversationDocument,
} from './entities/conversation.entity';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getConversationToReceiverUserId(receiverUserId: string) {
    const setUsersSend = new Set();
    const conversations = await this.conversationModel.find({
      participants: { $all: [receiverUserId] },
    });
    return conversations;
  }

  updateReceiverConversationHandler = async (receiverUserId: string) => {
    try {
      const setUsersSend = new Set();
      const conversations = await this.conversationModel.find({
        participants: { $all: [receiverUserId] },
      });
      await Promise.all(
        conversations.map(async (conversation) => {
          const userId =
            conversation.participants[0].toString() === receiverUserId
              ? conversation.participants[1]
              : conversation.participants[0];
          const user = await this.userModel.findById(userId);
          const {
            _id: id,
            userName,
            fullName,
            age,
            email,
            avatar,
            follower_count,
            following_count,
          } = user;
          setUsersSend.add({
            id,
            userName,
            fullName,
            age,
            email,
            avatar,
            follower_count,
            following_count,
          });
        }),
      );
      const usersSend = Array.from(setUsersSend);
      return usersSend;
    } catch (error) {
      console.log(error);
    }
  };
}

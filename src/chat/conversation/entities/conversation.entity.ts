import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/chat/message/entities/message.entity';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation extends Document {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  participants: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Message.name }] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

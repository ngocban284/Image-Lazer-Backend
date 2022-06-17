import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type MessageDocument = Message & Document;

@Schema()
export class Message extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: User;

  @Prop()
  content: string;

  @Prop()
  date: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

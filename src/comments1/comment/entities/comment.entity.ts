import { User } from 'src/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CommentDocument = Comment1 & Document;

@Schema({ timestamps: true })
export class Comment1 extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  author: User;

  @Prop()
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Comment1.name,
    default: null,
  })
  parentCommentId: Comment1;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  likes: mongoose.Schema.Types.ObjectId[];
}

export const Comment1Schema = SchemaFactory.createForClass(Comment1);

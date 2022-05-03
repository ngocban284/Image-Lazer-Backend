import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

export type CommentDocument = Document & Comment;

Schema({ timestamps: true });
export class Comment {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongoSchema.Types.ObjectId;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Post', required: true })
  post_id: MongoSchema.Types.ObjectId;

  @Prop({ required: true })
  body: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Comment', required: false })
  parentComment_id: MongoSchema.Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['Post', 'Comment'] })
  parentType: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

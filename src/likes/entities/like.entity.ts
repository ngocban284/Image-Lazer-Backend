import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

export type LikeDocument = Document & Like;

Schema({ timestamps: true });
export class Like {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongoSchema.Types.ObjectId;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Post', required: true })
  post_id: MongoSchema.Types.ObjectId;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Comment', required: true })
  parentComment_id: MongoSchema.Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['Post', 'Comment'] })
  parentType: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

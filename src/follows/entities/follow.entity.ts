import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

Schema({ timestamps: true });
export class Follow extends Document {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongoSchema.Types.ObjectId;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
  followed_user_id: MongoSchema.Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema({ timestamps: true })
export class SavePost extends Document {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongoSchema.Types.ObjectId;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Post', required: true })
  post_id: MongoSchema.Types.ObjectId;
}

export const savePostSchema = SchemaFactory.createForClass(SavePost);

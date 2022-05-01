import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

export type AlbumDocument = Document & Album;

Schema({ timestamps: true });
export class Album {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongoSchema.Types.ObjectId;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Post', required: true })
  post_id: MongoSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

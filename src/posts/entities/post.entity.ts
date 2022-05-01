import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

Schema({ timestamps: true });
export class Post extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, unique: true })
  image: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
export class Album extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

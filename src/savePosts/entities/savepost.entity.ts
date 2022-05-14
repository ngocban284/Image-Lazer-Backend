import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema, Types } from 'mongoose';
import { Album } from 'src/albums/entities/album.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Schema({ timestamps: true })
export class SavePost extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Album.name, required: false })
  album_id: Types.ObjectId;
}

export const savePostSchema = SchemaFactory.createForClass(SavePost);

import { Post } from '../../../posts/entities/post.entity';
import { Comment1 } from '../../comment/entities/comment.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ImageCommentsDocument = ImageComments & Document;

@Schema()
export class ImageComments extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name })
  imageId: Post;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment1.name }],
  })
  comments: mongoose.Types.ObjectId[];
}

export const ImageCommentsSchema = SchemaFactory.createForClass(ImageComments);

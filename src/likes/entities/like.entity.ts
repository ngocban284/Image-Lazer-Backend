// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Schema as MongoSchema } from 'mongoose';

// Schema({ timestamps: true });
// export class Like extends Document {
//   @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
//   user_id: MongoSchema.Types.ObjectId;

//   @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Post', required: true })
//   post_id: MongoSchema.Types.ObjectId;

//   @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Comment', required: true })
//   parentComment_id: MongoSchema.Types.ObjectId;

//   @Prop({ type: String, required: true, enum: ['Post', 'Comment'] })
//   parentType: string;
// }

// export const LikeSchema = SchemaFactory.createForClass(Like);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Comment.name, required: false })
  parentComment_id: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

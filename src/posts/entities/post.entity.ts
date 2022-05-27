// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Schema as MongoSchema } from 'mongoose';

// Schema({ timestamps: true });
// export class Post extends Document {
//   @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
//   user_id: MongoSchema.Types.ObjectId;

//   @Prop({ required: true })
//   photo_url: string;

//   @Prop({ required: false })
//   description: string;

//   @Prop({ required: false })
//   website: string;

//   @Prop({ required: true })
//   tags: string;
// }

// export const PostSchema = SchemaFactory.createForClass(Post);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  photo_url: string;

  @Prop({ required: false })
  photo_height: number;

  @Prop({ required: false })
  photo_width: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  website: string;

  @Prop({ required: true })
  tags: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  profile_url: string;

  @Prop({ required: true, default: false })
  avatar: string;

  @Prop({ required: false, default: 0 })
  follow_count: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

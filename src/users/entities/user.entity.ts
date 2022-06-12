import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  profile_url: string;

  @Prop({
    required: false,
    default: 'default_avatar.png',
  })
  avatar: string;

  @Prop({ required: false })
  avatar_height: number;

  @Prop({ required: false })
  avatar_width: number;

  @Prop({ required: false, default: 0 })
  following_count: number;

  @Prop({ required: false, default: 0 })
  follower_count: number;

  @Prop({ required: false })
  topics: string[];

  @Prop({ required: false })
  refreshToken: string;

  @Prop({ required: false })
  refreshTokenExpiry: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

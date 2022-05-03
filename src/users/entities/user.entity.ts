import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = Document & User;

@Schema({ timestamps: true })
export class User {
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

  @Prop({
    required: true,
    default:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  })
  avatar: string;

  @Prop({ required: false, default: 0 })
  follow_count: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function (next) {
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

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

import { IsOptional, IsNotEmpty } from 'class-validator';
import { Types, ObjectId } from 'mongoose';

export class FollowDto {
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @IsNotEmpty()
  followed_user_id: Types.ObjectId;
}

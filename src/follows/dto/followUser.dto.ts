import { IsOptional, IsNotEmpty } from 'class-validator';
import { Types, ObjectId } from 'mongoose';

export class FollowDto {
  @IsNotEmpty()
  followed_user_id: Types.ObjectId;
}

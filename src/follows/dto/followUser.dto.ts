import { IsOptional, IsNotEmpty } from 'class-validator';
import { Types, ObjectId } from 'mongoose';

export class FollowDto {
  @IsOptional()
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @IsOptional()
  @IsNotEmpty()
  followed_user_id: Types.ObjectId;
}

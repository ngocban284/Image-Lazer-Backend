import { IsOptional } from 'class-validator';
import { Schema as MongoSchema } from 'mongoose';

export class FollowDto {
  @IsOptional()
  user_id: MongoSchema.Types.ObjectId;

  @IsOptional()
  followed_user_id: MongoSchema.Types.ObjectId;
}

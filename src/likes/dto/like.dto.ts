import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class CreateLikeDto {
  @IsOptional()
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @IsOptional()
  post_id: Types.ObjectId;

  @IsOptional()
  parentComment_id: Types.ObjectId;
}

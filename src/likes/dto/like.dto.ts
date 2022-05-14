import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class CreateLikeDto {
  @IsOptional()
  post_id: Types.ObjectId;

  @IsOptional()
  parentComment_id: Types.ObjectId;
}

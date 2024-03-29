import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class CreateCommentDto {
  @IsOptional()
  post_id: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  parentComment_id: Types.ObjectId;
}

import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class CreatePostDto {
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  photo_url: string;

  @IsString()
  description: string;

  @IsString()
  website: string;

  @IsString()
  @IsNotEmpty()
  tags: string;
}

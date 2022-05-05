import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class CreatePostDto {
  @IsOptional()
  user_id: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  photo_url: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsString()
  @IsNotEmpty()
  tags: string;
}

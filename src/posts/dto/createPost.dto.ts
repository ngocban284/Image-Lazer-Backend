import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class CreatePostDto {
  @IsString()
  description: string;

  @IsString()
  website: string;

  @IsString()
  @IsNotEmpty()
  tags: string;
}

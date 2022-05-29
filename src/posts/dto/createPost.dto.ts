import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class CreatePostDto {
  @IsOptional()
  album: string;

  @IsString()
  image: string;

  @IsNumber()
  image_height: number;

  @IsNumber()
  image_width: number;

  @IsString()
  description: string;

  @IsString()
  link: string;

  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  topic: string;
}

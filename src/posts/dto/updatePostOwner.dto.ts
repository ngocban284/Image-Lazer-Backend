import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class UpdatePostOwnerDto {
  @IsOptional()
  album?: string;

  @IsString()
  description?: string;

  @IsString()
  link?: string;

  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  topic?: string;
}

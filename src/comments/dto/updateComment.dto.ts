import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body: string;
}

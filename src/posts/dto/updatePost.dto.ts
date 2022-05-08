import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema } from 'mongoose';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsString()
  tags: string;
}

import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class GetPostDto {
  @IsOptional()
  @IsNumber()
  pageNumber: number;

  @IsOptional()
  @IsNumber()
  limit: number;
}

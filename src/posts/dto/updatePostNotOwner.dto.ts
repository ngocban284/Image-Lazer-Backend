import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class UpdatePostNotOwnerDto {
  @IsOptional()
  album: string;
}

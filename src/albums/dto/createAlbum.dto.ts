import { IsOptional, IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class CreateAlbumDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsBoolean()
  secret: boolean;
}

import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class SavePostDto {
  @IsOptional()
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @IsOptional()
  @IsNotEmpty()
  post_id: Types.ObjectId;
}

import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Schema as MongoSchema, Types } from 'mongoose';

export class AddPostToAlbumDto {
  @IsOptional()
  album_id: Types.ObjectId;

  @IsOptional()
  post_id: Types.ObjectId;

  @IsString()
  description: string;

  @IsString()
  link: string;

  @IsString()
  topic: string;

  @IsString()
  image: string;

  @IsNumber()
  image_height: number;

  @IsNumber()
  image_width: number;

  @IsString()
  title: string;
}

// export class CreatePostDto {
//   @IsString()
//   description: string;

//   @IsString()
//   website: string;

//   @IsString()
//   @IsNotEmpty()
//   tags: string;
// }

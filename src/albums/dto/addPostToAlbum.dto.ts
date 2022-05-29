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
  description_post: string;

  @IsString()
  website_post: string;

  @IsString()
  tags_post: string;

  @IsString()
  fileName: string;

  @IsNumber()
  photo_height: number;

  @IsNumber()
  photo_width: number;
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

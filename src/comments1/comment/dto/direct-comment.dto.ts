import { IsNotEmpty, IsString } from 'class-validator';

export class DirectCommentDto {
  @IsNotEmpty()
  @IsString()
  imageId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  parentCommentId?: string;
}

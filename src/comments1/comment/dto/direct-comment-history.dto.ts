import { IsNotEmpty, IsString } from 'class-validator';

export class DirectCommentHistoryDto {
  @IsNotEmpty()
  @IsString()
  imageId: string;
}

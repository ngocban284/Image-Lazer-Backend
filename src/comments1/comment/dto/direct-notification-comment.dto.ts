import { IsNotEmpty, IsString } from 'class-validator';

export class DirectNotificationCommentDto {
  @IsNotEmpty()
  @IsString()
  imageId: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class DirectNotificationMessageDto {
  @IsNotEmpty()
  @IsString()
  receiverUserId: string;
}

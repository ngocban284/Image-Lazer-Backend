import { IsNotEmpty, IsString } from 'class-validator';

export class DirectChatHistoryDto {
  @IsNotEmpty()
  @IsString()
  receiverUserId: string;
}

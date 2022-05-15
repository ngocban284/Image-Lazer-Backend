import { IsNotEmpty, IsString } from 'class-validator';

export class DirectMessageDto {
  @IsNotEmpty()
  @IsString()
  receiverUserId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

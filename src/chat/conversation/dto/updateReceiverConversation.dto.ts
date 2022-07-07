import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReceiverConversationDto {
  @IsNotEmpty()
  @IsString()
  receiverUserId: string;
}

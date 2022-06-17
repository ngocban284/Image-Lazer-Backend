import { IsNotEmpty, IsString } from 'class-validator';

export class AddNewConnectedUserDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

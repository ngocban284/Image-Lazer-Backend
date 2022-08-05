import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class SearchUserDto {
  @IsString()
  user: string;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  userName?: string;

  @IsString()
  @IsNotEmpty()
  fullname?: string;

  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  description?: string;

  @IsString()
  profile_url?: string;
}

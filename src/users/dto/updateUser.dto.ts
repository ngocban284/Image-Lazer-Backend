import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  userName?: string;

  @IsString()
  @IsNotEmpty()
  fullname?: string;

  @IsNumber()
  @Min(10)
  age?: number;

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

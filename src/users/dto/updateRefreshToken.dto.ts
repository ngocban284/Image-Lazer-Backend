import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateRefreshTokenDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  refreshTokenExpiry: number;
}

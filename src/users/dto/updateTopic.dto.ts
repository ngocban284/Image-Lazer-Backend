import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateUserTopicDto {
  @IsString()
  @IsNotEmpty()
  topic?: string[];
}

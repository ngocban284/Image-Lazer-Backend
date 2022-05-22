/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer.config';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async uploadFile(@UploadedFile() avatar) {
    console.log(avatar);
    return avatar;
  }
}

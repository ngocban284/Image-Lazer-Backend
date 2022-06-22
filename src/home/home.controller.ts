/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Res,
  Req,
  HttpStatus,
  Param,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { Schema as MongoSchema, Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { HomeService } from './home.service';
import { JwtGuard } from '../users/jwt/guards/jwt.guard';

@Controller('home')
export class HomeControllerController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private homeService: HomeService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async home(@Req() request, @Res() res: Response) {
    try {
      const posts = await this.homeService.home(request.user._id);
      //   console.log(request.user._id);
      return res
        .status(HttpStatus.OK)
        .json({ errorCode: 0, message: 'Tải trang chủ thành công !', posts });
    } catch (err) {
      return res
        .status(HttpStatus.OK)
        .json({ errorCode: 1, message: 'Tải trang chủ thất bại !' });
    }
  }
}

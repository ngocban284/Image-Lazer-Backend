/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Res,
  HttpStatus,
  Param,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Schema as MongoSchema, Connection } from 'mongoose';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/like.dto';
import { GetLikeDto } from './dto/getLike.dto';

@Controller('likes')
export class LikesController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private likesService: LikesService,
  ) {}

  @Post()
  async createLike(@Body() createLikeDto: CreateLikeDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    console.log(createLikeDto);

    try {
      const like = await this.likesService.createLike(createLikeDto, session);
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(like);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Get()
  async getLikes(@Body() getLikeDto: GetLikeDto, @Res() res: Response) {
    const likes = await this.likesService.getLikes(getLikeDto);
    return res.status(HttpStatus.OK).json(likes);
  }
}

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
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Schema as MongoSchema, Connection } from 'mongoose';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/like.dto';
import { GetLikeDto } from './dto/getLike.dto';
import { JwtGuard } from 'src/users/jwt/guards/jwt.guard';

@Controller('likes')
export class LikesController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private likesService: LikesService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async createLike(
    @Body() createLikeDto: CreateLikeDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    console.log(createLikeDto);

    try {
      const like = await this.likesService.createLike(
        request.user._id,
        createLikeDto,
        session,
      );
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

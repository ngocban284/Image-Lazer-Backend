import { JwtGuard } from 'src/users/jwt/guards/jwt.guard';
/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  HttpStatus,
  Body,
  Res,
  Req,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowDto } from './dto/followUser.dto';
import { Schema as MongoSchema, Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';

@Controller('follows')
export class FollowsController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly followsService: FollowsService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async followUser(
    @Body() followDto: FollowDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const follow = await this.followsService.followUser(
        request.user._id,
        followDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(follow);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Delete()
  @UseGuards(JwtGuard)
  async unfollowUser(
    @Body() followDto: FollowDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const follow = await this.followsService.unfollowUser(
        request.user._id,
        followDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json({ message: 'Unfollowed', follow });
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Get('followed/:user_id')
  async followedUser(
    @Param('user_id') user_id: Types.ObjectId,
    @Res() res: Response,
  ) {
    const list = await this.followsService.followedUser(user_id);
    return res.status(HttpStatus.OK).json(list);
  }

  @Get('followedBy/:user_id')
  async followedByUser(
    @Param('user_id') user_id: Types.ObjectId,
    @Res() res: Response,
  ) {
    const list = await this.followsService.followedByUser(user_id);
    return res.status(HttpStatus.OK).json(list);
  }
}

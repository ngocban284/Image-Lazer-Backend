/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  HttpStatus,
  Body,
  Res,
  Get,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowDto } from './dto/followUser.dto';
import { Schema as MongoSchema, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';

@Controller('follows')
export class FollowsController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly followsService: FollowsService,
  ) {}

  @Post()
  async followUser(@Body() followDto: FollowDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const follow = await this.followsService.followUser(followDto, session);
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
  async unfollowUser(@Body() followDto: FollowDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const follow = await this.followsService.unfollowUser(followDto, session);
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(follow);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Get('followed')
  async followedUser(@Param() user_id: MongoSchema.Types.ObjectId) {
    return await this.followsService.followedUser(user_id);
  }

  @Get('followedBy')
  async followedByUser(@Param() user_id: MongoSchema.Types.ObjectId) {
    return await this.followsService.followedByUser(user_id);
  }
}

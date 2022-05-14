/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Res,
  Req,
  HttpStatus,
  Param,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { GetCommentDto } from './dto/getComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { JwtGuard } from 'src/users/jwt/guards/jwt.guard';

@Controller('/comments')
export class CommentsController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private commentsService: CommentsService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const comment = await this.commentsService.createComment(
        request.user._id,
        createCommentDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(comment);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Get()
  async getComments(
    @Body() getCommentDto: GetCommentDto,
    @Res() res: Response,
  ) {
    const comments = await this.commentsService.getComments(getCommentDto);
    return res.status(HttpStatus.OK).json(comments);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateComment(
    @Param('id') comment_id: Types.ObjectId,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const comment = await this.commentsService.updateComment(
        request.user._id,
        comment_id,
        updateCommentDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(comment);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteComment(
    @Param('id') comment_id: Types.ObjectId,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const comment = await this.commentsService.deleteComment(
        request.user._id,
        comment_id,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(comment);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }
}

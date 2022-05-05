/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Res,
  HttpStatus,
  Param,
  Body,
  Post,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { GetCommentDto } from './dto/getComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('/comments')
export class CommentsController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private commentsService: CommentsService,
  ) {}

  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const comment = await this.commentsService.createComment(
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
  async updateComment(
    @Param('id') comment_id: Types.ObjectId,
    @Body() updateCommentDto: UpdateCommentDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const comment = await this.commentsService.updateComment(
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
  async deleteComment(
    @Param('id') comment_id: Types.ObjectId,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const comment = await this.commentsService.deleteComment(
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

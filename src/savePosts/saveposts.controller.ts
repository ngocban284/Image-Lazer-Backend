import {
  Body,
  Res,
  HttpStatus,
  Param,
  Controller,
  Delete,
  Get,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { Schema as MongoSchema, Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { SavePostService } from './saveposts.service';
import { SavePostDto } from './dto/savepost.dto';

@Controller('saveposts')
export class SavePostController {
  constructor(
    private readonly savePostService: SavePostService,
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  @Post()
  async createSavePost(@Body() savePostDto: SavePostDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const savePost = await this.savePostService.createSavePost(
        savePostDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(savePost);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Get('/:user_id')
  async getSavePost(
    @Param('user_id') user_id: Types.ObjectId,
    @Res() res: Response,
  ) {
    const savePost = await this.savePostService.getSavePost(user_id);
    return res.status(HttpStatus.OK).json(savePost);
  }

  @Get('/:post_id')
  async getSavePostById(
    @Param('post_id') post_id: Types.ObjectId,
    @Res() res: Response,
  ) {
    const savePost = await this.savePostService.getSavePostById(post_id);
    return res.status(HttpStatus.OK).json(savePost);
  }

  @Delete('/:post_id')
  async deleteSavePost(
    @Param('post_id') post_id: Types.ObjectId,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const savePost = await this.savePostService.deleteSavePost(
        post_id,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(savePost);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }
}

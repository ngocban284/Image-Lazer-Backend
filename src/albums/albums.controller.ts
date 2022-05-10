import {
  Body,
  Res,
  HttpStatus,
  Param,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { Schema as MongoSchema, Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { DeletePostOfAlbumDto } from './dto/deletePostOfAlbum.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly albumService: AlbumsService,
  ) {}

  @Post()
  async createAlbum(@Body() albumDto: CreateAlbumDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    // console.log(albumDto);

    try {
      const album = await this.albumService.createAlbum(albumDto, session);
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(album);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Get()
  async getAlbum(@Res() res: Response) {
    const album = await this.albumService.getAlbum();
    return res.status(HttpStatus.OK).json(album);
  }

  @Get('/users/:user_id')
  async getAlbumById(
    @Param('user_id') user_id: Types.ObjectId,
    @Res() res: Response,
  ) {
    const album = await this.albumService.getAlbumByUser(user_id);
    return res.status(HttpStatus.OK).json(album);
  }

  @Patch('/:album_id')
  async updateAlbum(
    @Param('album_id') album_id: Types.ObjectId,
    @Body() albumDto: UpdateAlbumDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const album = await this.albumService.updateAlbum(
        album_id,
        albumDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(album);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Delete('/:album_id')
  async deleteAlbum(
    @Param('album_id') album_id: Types.ObjectId,
    @Body() deletePost: DeletePostOfAlbumDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const album = await this.albumService.deleteAlbum(
        album_id,
        deletePost,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(album);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }
}

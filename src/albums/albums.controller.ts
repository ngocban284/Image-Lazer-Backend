import {
  Body,
  Res,
  Req,
  HttpStatus,
  Param,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { Schema as MongoSchema, Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { AlbumsService } from './albums.service';
import { AddPostToAlbumDto } from './dto/addPostToAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { DeletePostOfAlbumDto } from './dto/deletePostOfAlbum.dto';
import { JwtGuard } from 'src/users/jwt/guards/jwt.guard';
import { CreatePostDto } from 'src/posts/dto/createPost.dto';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer.config';
import * as sizeOf from 'image-size';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly albumService: AlbumsService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async createAlbum(
    @Body() albumDto: CreateAlbumDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const album = await this.albumService.createAlbum(
        request.user._id,
        albumDto,
        session,
      );
      await session.commitTransaction();
      res
        .status(HttpStatus.OK)
        .json({ errorCode: 0, message: 'Tao mới Album thành công !', album });
    } catch (error) {
      await session.abortTransaction();
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errorCode: 1, message: 'Tạo mới Album thất bại !', error });
    }
  }

  @Post('/upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  async uploadPhoto(@UploadedFile() photo, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const demensions = sizeOf.imageSize(`./uploads/${photo.filename}`);
      await session.commitTransaction();
      res.status(HttpStatus.OK).json({
        errorCode: 0,
        message: 'Upload ảnh thành công !',
        fileName: photo.filename,
        photo_height: demensions.height,
        photo_width: demensions.width,
      });
    } catch (error) {
      await session.abortTransaction();
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errorCode: 1, error, message: 'Upload ảnh thất bại !' });
    }
  }

  @Post('/addPost')
  @UseGuards(JwtGuard)
  async addPostToAlbum(
    @Body() albumDto: AddPostToAlbumDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    // console.log(albumDto);

    try {
      const album = await this.albumService.addPostToAlbum(
        request.user._id,
        albumDto,
        session,
      );
      await session.commitTransaction();
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Đã thêm ảnh vào album !', album });
    } catch {
      await session.abortTransaction();
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Thêm ảnh vào album thất bại !' });
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
  @UseGuards(JwtGuard)
  async updateAlbum(
    @Param('album_id') album_id: Types.ObjectId,
    @Body() albumDto: UpdateAlbumDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const album = await this.albumService.updateAlbum(
        request.user._id,
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
  @UseGuards(JwtGuard)
  async deleteAlbum(
    @Param('album_id') album_id: Types.ObjectId,
    @Body() deletePost: DeletePostOfAlbumDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const album = await this.albumService.deleteAlbum(
        request.user._id,
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

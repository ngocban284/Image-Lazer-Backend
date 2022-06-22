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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Schema as MongoSchema, Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { SavePostService } from './saveposts.service';
import { SavePostDto } from './dto/savepost.dto';
import { JwtGuard } from 'src/users/jwt/guards/jwt.guard';
import { AddPostToAlbumDto } from './dto/addPostToAlbum.dto';

@Controller('saveposts')
@UseGuards(JwtGuard)
export class SavePostController {
  constructor(
    private readonly savePostService: SavePostService,
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  @Post()
  async addPostToAlbum(
    @Body() addPostToAlbumDto: AddPostToAlbumDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const albumOfUser = await this.savePostService.addPostToAlbum(
        request.user._id,
        addPostToAlbumDto,
        session,
      );
      await session.commitTransaction();
      res
        .status(HttpStatus.OK)
        .json({ errorCode: 0, message: 'Lưu ảnh thành công !', albumOfUser });
    } catch (error) {
      await session.abortTransaction();
      res

        .status(HttpStatus.ACCEPTED)
        .json({ errorCode: 1, message: 'Lưu ảnh thất bại !' });
    } finally {
      await session.endSession();
    }
  }

  @Get('/users')
  async getSavePost(@Req() request, @Res() res: Response) {
    const savePost = await this.savePostService.getSavePost(request.user._id);
    return res.status(HttpStatus.OK).json(savePost);
  }

  @Get('/:savepost_id')
  async getSavePostById(
    @Param('savepost_id') savepost_id: Types.ObjectId,
    @Res() res: Response,
  ) {
    // console.log(savepost_id);
    // return res.status(HttpStatus.OK).json(savepost_id);

    const savePost = await this.savePostService.getSavePostById(savepost_id);
    return res.status(HttpStatus.OK).json(savePost);
  }
}

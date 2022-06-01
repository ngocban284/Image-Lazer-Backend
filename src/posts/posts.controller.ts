/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  HttpStatus,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  Res,
  Req,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetPostDto } from './dto/getPost.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Response } from 'express';
import { Types, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { JwtGuard } from 'src/users/jwt/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer.config';
import * as sizeOf from 'image-size';

@Controller('posts')
export class PostsController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly postsService: PostsService,
  ) { }

  @Get()
  async getPosts(@Body() getPost: GetPostDto, @Res() res: Response) {
    let posts = await this.postsService.getPosts(getPost);
    res.status(HttpStatus.OK).json(posts);
  }

  @Post('uploadPostImage')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadPostImage(@UploadedFile() image, @Res() res: Response) {
    if (!image) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No file uploaded',
      });
    } else {
      let dimensions = sizeOf.imageSize(`./uploads/${image.filename}`);

      return res.status(HttpStatus.OK).json({
        errorCode: 0,
        message: 'Up load ảnh thành công',
        image: image.filename,
        image_height: dimensions.height,
        image_width: dimensions.width,
      });
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  async createPost(
    @Body() postDto: CreatePostDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const post: any = await this.postsService.createPost(
        request.user._id,
        postDto,
        session,
      );
      await session.commitTransaction();
      res.status(HttpStatus.OK).json({ errorCode: 0, post });
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  async updatePost(
    @Param('id') id: Types.ObjectId,
    @Body() postDto: UpdatePostDto,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const post = await this.postsService.updatePost(
        request.user._id,
        id,
        postDto,
        session,
      );
      await session.commitTransaction();
      res.status(HttpStatus.OK).json(post);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Delete('delete/:id')
  @UseGuards(JwtGuard)
  async deletePost(
    @Param('id') id: Types.ObjectId,
    @Req() request,
    @Res() res: Response,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const post = await this.postsService.deletePost(
        request.user._id,
        id,
        session,
      );

      await session.commitTransaction();

      res.status(HttpStatus.OK).json(post);
    } catch {
      await session.abortTransaction();

      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Get('/:id')
  async getPostById(@Param('id') id: Types.ObjectId, @Res() res: Response) {
    const post = await this.postsService.getPostById(id);
    res.status(HttpStatus.OK).json(post);
  }

  @Get('/tags')
  async getPostByTag(@Body() tags: string, @Res() res: Response) {
    const post = await this.postsService.getPostByTag(tags);
    res.status(HttpStatus.OK).json(post);
  }
}

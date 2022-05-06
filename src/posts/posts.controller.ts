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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetPostDto } from './dto/getPost.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Response } from 'express';
import { Types, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('posts')
export class PostsController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async getPosts(getPost: GetPostDto, @Res() res: Response) {
    let posts = await this.postsService.getPosts(getPost);
    res.status(HttpStatus.OK).json(posts);
  }

  @Post()
  async createPost(postDto: CreatePostDto, @Res() res: Response) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const post = await this.postsService.createPost(postDto, session);
      await session.commitTransaction();
      res.status(HttpStatus.OK).json(post);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Patch('/:id')
  async updatePost(
    @Param('id') id: Types.ObjectId,
    postDto: UpdatePostDto,
    @Res() res: Response,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const post = await this.postsService.updatePost(id, postDto, session);
      await session.commitTransaction();
      res.status(HttpStatus.OK).json(post);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: Types.ObjectId, @Res() res: Response) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const post = await this.postsService.deletePost(id, session);

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
  async getPostByTag(tags: string, @Res() res: Response) {
    const post = await this.postsService.getPostByTag(tags);
    res.status(HttpStatus.OK).json(post);
  }
}

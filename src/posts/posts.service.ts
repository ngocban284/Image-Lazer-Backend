/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { GetPostDto } from './dto/getPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { UpdatePostOwnerDto } from './dto/updatePostOwner.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(
    user_id: Types.ObjectId,
    postDto: CreatePostDto,
    session: ClientSession,
  ) {
    return await this.postRepository.createPost(user_id, postDto, session);
  }

  async getPosts(getPost: GetPostDto) {
    return await this.postRepository.getPost(getPost);
  }

  async updatePost(
    user_id: Types.ObjectId,
    post_id: Types.ObjectId,
    updatePostDto: UpdatePostOwnerDto,
    session: ClientSession,
  ) {
    return await this.postRepository.updatePost(
      user_id,
      post_id,
      updatePostDto,
      session,
    );
  }

  async deletePost(
    user_id: Types.ObjectId,
    post_id: Types.ObjectId,
    session: ClientSession,
  ) {
    return await this.postRepository.deletePost(user_id, post_id, session);
  }

  async getPostById(post_id: Types.ObjectId) {
    return await this.postRepository.getPostById(post_id);
  }

  async getPostByTag(tag: string) {
    return await this.postRepository.getPostByTag(tag);
  }
}

/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { SavePostRepository } from './saveposts.repository';
import { SavePostDto } from './dto/savepost.dto';
import { AddPostToAlbumDto } from './dto/addPostToAlbum.dto';

@Injectable()
export class SavePostService {
  constructor(private readonly savePostRepository: SavePostRepository) {}

  async addPostToAlbum(
    user_id: Types.ObjectId,
    addPostToAlbum: AddPostToAlbumDto,
    session: ClientSession,
  ) {
    return await this.savePostRepository.addPostToAlbum(
      user_id,
      addPostToAlbum,
      session,
    );
  }

  async createSavePost(
    user_id: Types.ObjectId,
    savePostDto: SavePostDto,
    session: ClientSession,
  ) {
    return await this.savePostRepository.createSavePost(
      user_id,
      savePostDto,
      session,
    );
  }

  async getSavePost(user_id: Types.ObjectId) {
    return await this.savePostRepository.getSavePost(user_id);
  }

  async getSavePostById(savepost_id: Types.ObjectId) {
    return await this.savePostRepository.getSavePostById(savepost_id);
  }
}

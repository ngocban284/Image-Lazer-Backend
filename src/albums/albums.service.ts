/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { AlbumRepository } from './albums.repository';
import { AddPostToAlbumDto } from './dto/addPostToAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { DeletePostOfAlbumDto } from './dto/deletePostOfAlbum.dto';
import { CreateAlbumDto } from './dto/createAlbum.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async createAlbum(
    user_id: Types.ObjectId,
    createAlbumDto: CreateAlbumDto,
    session: ClientSession,
  ) {
    return await this.albumRepository.createAlbum(
      user_id,
      createAlbumDto,
      session,
    );
  }

  async addPostToAlbum(
    user_id: Types.ObjectId,
    albumDto: AddPostToAlbumDto,
    session: ClientSession,
  ) {
    return await this.albumRepository.addPostToAlbum(
      user_id,
      albumDto,
      session,
    );
  }

  async getAlbum() {
    return await this.albumRepository.getAlbum();
  }

  async getAlbumByUser(user_id: Types.ObjectId) {
    return await this.albumRepository.getAlbumByUser(user_id);
  }

  async getAlbumById(album_id: Types.ObjectId) {
    return await this.albumRepository.getAlbumById(album_id);
  }

  async updateAlbum(
    user_id: Types.ObjectId,
    album_id: Types.ObjectId,
    updateAlbumDto: UpdateAlbumDto,
    session: ClientSession,
  ) {
    return await this.albumRepository.updateAlbum(
      user_id,
      album_id,
      updateAlbumDto,
      session,
    );
  }

  async deletePostOfAlbum(
    user_id: Types.ObjectId,
    deletePost: DeletePostOfAlbumDto,
    session: ClientSession,
  ) {
    return await this.albumRepository.deletePostOfAlbum(
      user_id,
      deletePost,
      session,
    );
  }

  async deleteAlbum(
    user_id: Types.ObjectId,
    album_id: Types.ObjectId,
    session: ClientSession,
  ) {
    return await this.albumRepository.deleteAlbum(user_id, album_id, session);
  }
}

/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { AlbumRepository } from './albums.repository';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async createAlbum(albumDto: CreateAlbumDto, session: ClientSession) {
    return await this.albumRepository.createAlbum(albumDto, session);
  }

  async getAlbum() {
    return await this.albumRepository.getAlbum();
  }

  async getAlbumByUser(user_id: Types.ObjectId) {
    return await this.albumRepository.getAlbumByUser(user_id);
  }

  async updateAlbum(
    album_id: Types.ObjectId,
    updateAlbumDto: UpdateAlbumDto,
    session: ClientSession,
  ) {
    return await this.albumRepository.updateAlbum(
      album_id,
      updateAlbumDto,
      session,
    );
  }

  async deleteAlbum(album_id: Types.ObjectId, session: ClientSession) {
    return await this.albumRepository.deleteAlbum(album_id, session);
  }
}

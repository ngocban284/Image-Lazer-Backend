/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema } from 'mongoose';
import { LikeRepository } from './likes.repository';
import { CreateLikeDto } from './dto/like.dto';
import { GetLikeDto } from './dto/getLike.dto';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async createLike(likeDto: CreateLikeDto, session: ClientSession) {
    return await this.likeRepository.createLike(likeDto, session);
  }

  async getLikes(getLikeDto: GetLikeDto) {
    return await this.likeRepository.getLikes(getLikeDto);
  }
}

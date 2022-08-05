/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { FollowDto } from './dto/followUser.dto';
import { FollowRepository } from './follows.repository';

@Injectable()
export class FollowsService {
  constructor(private readonly followRepository: FollowRepository) {}

  async followUser(
    user_id: Types.ObjectId,
    followDto: FollowDto,
    session: ClientSession,
  ) {
    return await this.followRepository.followUser(user_id, followDto, session);
  }

  async followedUser(user_id: Types.ObjectId) {
    return await this.followRepository.followedUser(user_id);
  }

  async followedByUser(user_id: Types.ObjectId) {
    return await this.followRepository.followedByUser(user_id);
  }
}

/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema } from 'mongoose';
import { FollowDto } from './dto/followUser.dto';
import { FollowRepository } from './follows.repository';

@Injectable()
export class FollowsService {
  constructor(private readonly followRepository: FollowRepository) {}

  async followUser(followDto: FollowDto, session: ClientSession) {
    return await this.followRepository.followUser(followDto, session);
  }

  async unfollowUser(followDto: FollowDto, session: ClientSession) {
    return await this.followRepository.unfollowUser(followDto, session);
  }

  async followedUser(user_id: MongoSchema.Types.ObjectId) {
    return await this.followRepository.followedUser(user_id);
  }

  async followedByUser(user_id: MongoSchema.Types.ObjectId) {
    return await this.followRepository.followedByUser(user_id);
  }
}

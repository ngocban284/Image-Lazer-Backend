import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';
import { FollowDto } from './dto/followUser.dto';
import { Follow } from './entities/follow.entity';

export class FollowRepository {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
  ) {}

  async followedUser(user_id: Types.ObjectId) {
    console.log(user_id);
    const data = await this.followModel
      .find({ followed_user_id: user_id })
      .populate('user_id')
      .populate('followed_user_id');

    return data;
  }

  async followedByUser(user_id: Types.ObjectId) {
    const data = await this.followModel
      .find({ user_id: user_id })
      .populate('user_id')
      .populate('followed_user_id');

    return data;
  }

  async followUser(followDto: FollowDto, session: ClientSession) {
    const user_id = followDto.user_id;
    const followed_user_id = followDto.followed_user_id;

    const followed = await this.followModel.findOne({
      user_id,
      followed_user_id,
    });

    if (followed) {
      throw new ConflictException('You are already following this user');
    } else {
      try {
        const follow = new this.followModel({
          user_id,
          followed_user_id,
        });
        await follow.save({ session });
        return follow;
      } catch {
        throw new InternalServerErrorException();
      }
    }
  }

  async unfollowUser(unfollowDto: FollowDto, session: ClientSession) {
    const user_id = unfollowDto.user_id;
    const followed_user_id = unfollowDto.followed_user_id;
    try {
      await this.followModel.deleteOne(
        { user_id, followed_user_id },
        { session },
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

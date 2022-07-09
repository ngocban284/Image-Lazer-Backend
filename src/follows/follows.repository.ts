import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';
import { FollowDto } from './dto/followUser.dto';
import { Follow } from './entities/follow.entity';
import { User } from 'src/users/entities/user.entity';

export class FollowRepository {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // xem 1 nguoi duoc bao nhieu nguoi theo doi
  async followedUser(user_id: Types.ObjectId) {
    const data = await this.followModel
      .find({ followed_user_id: user_id })
      .populate('user_id')
      .populate('followed_user_id');

    return data;
  }

  // xem 1 nguoi theo doi bao nhieu nguoi
  async followedByUser(user_id: Types.ObjectId) {
    const data = await this.followModel
      .find({ user_id: user_id })
      .populate('user_id')
      .populate('followed_user_id');

    return data;
  }

  async followUser(
    user_id: Types.ObjectId,
    followDto: FollowDto,
    session: ClientSession,
  ) {
    const followed_user_id = followDto.followed_user_id;

    const followed = await this.followModel.findOne({
      user_id: user_id + '',
      followed_user_id: followed_user_id + '',
    });
    // console.log(followed);

    
    if (followed) {
      try {
        await this.followModel.deleteOne(
          { user_id: user_id + '', followed_user_id: followed_user_id + '' },
          { session },
        );
        await this.userModel.updateOne(
          { _id: user_id + '' },
          { $inc: { follow_count: -1 } },
          { session },
        );
        await this.userModel.updateOne(
          { _id: followed_user_id + '' },
          { $inc: { follower_count: -1 } },
          { session },
        );
      } catch (error) {
        throw new InternalServerErrorException();
      }
    } else {
      try {
        const follow = new this.followModel({
          user_id: user_id + '',
          followed_user_id: followed_user_id + '',
        });
        await follow.save({ session });
        await this.userModel.updateOne(
          { _id: user_id },
          { $inc: { follow_count: 1 } },
          { session },
        );
        await this.userModel.updateOne(
          { _id: followed_user_id },
          { $inc: { follower_count: 1 } },
          { session },
        );
        return follow;
      } catch {
        throw new InternalServerErrorException();
      }
    }
  }
}

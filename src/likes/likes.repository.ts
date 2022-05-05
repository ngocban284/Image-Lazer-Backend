import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './entities/like.entity';
import { Types, ClientSession, Model } from 'mongoose';
import { CreateLikeDto } from './dto/like.dto';
import { GetLikeDto } from './dto/getLike.dto';

export class LikeRepository {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
  ) {}

  async createLike(likeDto: CreateLikeDto, session: ClientSession) {
    if (likeDto.post_id) {
      let like = await this.likeModel.findOne({
        $and: [{ post_id: likeDto.post_id }, { user_id: likeDto.user_id }],
      });

      if (like) {
        let likeDelete = await this.likeModel.findByIdAndDelete(like._id, {
          session: session,
        });
        return { likeDelete: false };
      } else {
        let like = new this.likeModel(likeDto);
        await like.save({ session: session });
        return { like: true };
      }
    } else {
      let like = await this.likeModel.findOne({
        $and: [
          { parentComment_id: likeDto.parentComment_id },
          { user_id: likeDto.user_id },
        ],
      });

      if (like) {
        let likeDelete = await this.likeModel.findByIdAndDelete(like._id, {
          session: session,
        });
        return { likeDelete: false };
      } else {
        let like = new this.likeModel(likeDto);
        await like.save({ session: session });
        return { like: true };
      }
    }
  }

  async getLikes(getLikeDto: GetLikeDto) {
    try {
      if (getLikeDto.post_id) {
        let likes = await this.likeModel.find({ post_id: getLikeDto.post_id });
        return likes;
      } else {
        let likes = await this.likeModel.find({
          parentComment_id: getLikeDto.parentComment_id,
        });
        return likes;
      }
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

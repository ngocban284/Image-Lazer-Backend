import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';
import { SavePost } from './entities/savepost.entity';
import { SavePostDto } from './dto/savepost.dto';

export class SavePostRepository {
  constructor(
    @InjectModel(SavePost.name) private readonly savePostModel: Model<SavePost>,
  ) {}

  async createSavePost(savePostDto: SavePostDto, session: ClientSession) {
    try {
      let savePost = await this.savePostModel.findOne({
        $and: [
          { user_id: savePostDto.user_id },
          { post_id: savePostDto.post_id },
        ],
      });

      if (savePost) {
        savePost = await this.savePostModel.findOneAndDelete(
          {
            $and: [
              { user_id: savePostDto.user_id },
              { post_id: savePostDto.post_id },
            ],
          },
          { session: session },
        );
        return { savePost: false };
      } else {
        savePost = new this.savePostModel(savePostDto);
        savePost = await savePost.save({ session: session });
        return { savePost: true };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSavePost(user_id: Types.ObjectId) {
    try {
      let savePosts: any = await this.savePostModel
        .find({ user_id: user_id })
        .populate({
          path: 'post_id',
          populate: {
            path: 'user_id',
          },
        });

      savePosts = savePosts.map((savePost) => {
        return savePost.post_id;
      });
      return savePosts;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSavePostById(post_id: Types.ObjectId) {
    try {
      let savePost = await (
        await this.savePostModel.findById({ _id: post_id }).populate('user_id')
      ).populate('post_id');
      return savePost;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteSavePost(post_id: Types.ObjectId, session: ClientSession) {
    try {
      let savePost = await this.savePostModel.findOneAndDelete(
        { post_id: post_id },
        { session: session },
      );
      return savePost;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

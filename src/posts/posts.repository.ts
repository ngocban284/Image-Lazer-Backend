import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Follow } from 'src/follows/entities/follow.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { user_id, photo_url, description, website, tags } = createPostDto;
    const post = new this.postModel({
      user_id,
      photo_url,
      description,
      website,
      tags,
    });

    try {
      await post.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Post already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async attachFollowers(_id: Types.ObjectId) {
    let follower = await this.followModel
      .find({
        followed_user_id: _id,
      })
      .populate('user_id')
      .lean()
      .exec();

    return follower;
  }

  async attachLikes(post: Post) {}
}

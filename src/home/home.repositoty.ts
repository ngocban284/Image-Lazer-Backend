import {
  ConflictException,
  forwardRef,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Follow } from 'src/follows/entities/follow.entity';
import * as _ from 'lodash';

export class HomeRepositoty {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
  ) {}

  async home(user_id: Types.ObjectId) {
    // get topic of user
    try {
      let user = await this.userModel
        .findById({
          _id: user_id + '',
        })
        .lean()
        .exec();

      let topic = [];
      topic = user.topics;
      // console.log(topic);

      // find topic in post
      let posts = await this.postModel
        .find({
          topic: { $in: topic },
        })
        .lean()
        .exec();
      // console.log('post topic', posts);

      // get all user follow

      let follows = await this.followModel
        .find({
          user_id: user_id + '',
        })
        .populate({
          path: 'followed_user_id',
          select: '-password -refreshToken -__v -refreshTokenExpiry',
        })
        .lean()
        .exec();
      // console.log('follows: ', follows);

      let userFollows = [];
      let postOfUserFollow = [];

      follows.map((follow) => {
        userFollows.push(follow.followed_user_id._id + '');
      });
      // console.log('userFollows: ', userFollows);

      // get all post of user follow
      for (let i = 0; i < userFollows.length; i++) {
        let post = await this.postModel.find({
          user_id: userFollows[i],
        });
        for (let i = 0; i < post.length; i++) {
          postOfUserFollow.push(post[i]);
        }
      }

      // console.log('postFollow', postOfUserFollow);
      posts.concat(postOfUserFollow);

      posts = _.shuffle(posts);

      // find all post
      let allPost = await this.postModel.find();

      allPost.map((post: any) => {
        if (!posts.includes(post)) {
          posts.push(post);
        }
      });
      console.log('all post', allPost);

      return posts;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

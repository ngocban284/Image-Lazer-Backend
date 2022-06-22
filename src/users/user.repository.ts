import {
  ConflictException,
  forwardRef,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateUserTopicDto } from './dto/updateTopic.dto';
import { UpdateRefreshTokenDto } from './dto/updateRefreshToken.dto';
import { Post } from 'src/posts/entities/post.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Follow } from 'src/follows/entities/follow.entity';
import { Inject } from '@nestjs/common';
import * as sizeOf from 'image-size';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
  ) {}

  async attachFollower(user_id: Types.ObjectId) {
    const parserId = user_id.toString();
    const follow = await this.followModel
      .find({ followed_user_id: parserId })
      .populate({
        path: 'user_id',
        select: '-password -refreshToken -__v -refreshTokenExpiry',
      })
      .lean()
      .exec();

    const newFollow = [];
    follow.map((item) => {
      newFollow.push(item.user_id);
    });

    return newFollow;
  }

  async attachFollowing(user_id: Types.ObjectId) {
    const parserId = user_id.toString();

    const following = await this.followModel
      .find({ user_id: parserId })
      .populate({
        path: 'followed_user_id',
        select: '-password -refreshToken -__v -refreshTokenExpiry',
      })
      .lean()
      .exec();

    const newFollowing = [];
    following.map((item) => {
      const { _id, ...rest } = item.followed_user_id;
      newFollowing.push({ id: _id, ...rest });
    });

    return newFollowing;
  }

  async getAllUsers() {
    let users;
    try {
      users = await this.userModel.find();
    } catch {
      throw new InternalServerErrorException();
    }
    return users;
  }

  async getUserByEmail(email: string) {
    let user;
    try {
      user = await this.userModel.findOne({ email });
    } catch {
      throw new InternalServerErrorException();
    }
    return user;
  }

  async getUserById(id: Types.ObjectId | string) {
    let user;
    try {
      user = await this.userModel.findById(id);
    } catch {
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getUserByUserName(userName: string) {
    let user;
    let postOfUser;
    const createdImages = [];
    const nameAlbums = [];
    const imageAlbums = [];
    let albumsOfUser;
    const albums = [];
    let topics = [];
    let followers = [];
    let following = [];
    try {
      user = await this.userModel.findOne({ userName });

      followers = await this.attachFollower(user._id);

      following = await this.attachFollowing(user._id);

      // console.log('user', user);
      postOfUser = await this.postModel.find({ user_id: user._id + '' });
      // console.log('postOfUser', postOfUser);
      postOfUser.map((post) => {
        createdImages.push({
          id: post._id + '',
          name: post.name,
          src: '/uploads/' + post.image,
          height: post.image_height,
          width: post.image_width,
        });
      });

      topics = user.topics;

      albumsOfUser = await this.albumModel
        .find({ user_id: user._id + '' })
        .populate('post_id');

      albumsOfUser.map((album) => {
        nameAlbums.push(album.name);

        if (album.post_id.length >= 1) {
          imageAlbums.push(album.post_id[album.post_id.length - 1].image);
          albums.push({
            id: album._id,
            name: album.name,
            description: album.description,
            secret: album.secret,
            image: {
              name: album.post_id[album.post_id.length - 1].image,
              src: '/uploads/' + album.post_id[album.post_id.length - 1].image,
              height: album.post_id[album.post_id.length - 1].image_height,
              width: album.post_id[album.post_id.length - 1].image_width,
            },
          });
        } else {
          albums.push({
            id: album._id,
            name: album.name,
            description: album.description,
            secret: album.secret,
            image: {
              name: 'default_avatar_album.png',
              src: '/uploads/default_avatar_album.png',
              height: 400,
              width: 400,
            },
          });
        }
      });
    } catch {
      throw new InternalServerErrorException();
    }
    return { user, createdImages, albums, topics, followers, following };
  }

  async createUser(createUserDto: CreateUserDto, session: ClientSession) {
    const email = createUserDto.email;
    let userName = '@' + email.split('@')[0];

    let user = await this.getUserByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('Email already exists');
    }

    // console.log(createUserDto);
    user = new this.userModel({
      ...createUserDto,
      userName,
    });

    const album = new this.albumModel({
      user_id: user._id + '',
      name: 'Album mặc định',
      description: '',
      secret: false,
    });

    const allUser = await this.getAllUsers();

    userName = userName + '_' + allUser.length;

    await user.save();
    const newUser = await this.userModel.findByIdAndUpdate(
      user.id,
      { userName: userName },
      { new: true },
    );

    try {
      await album.save({ session });
      await newUser.save({ session });
      return newUser;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
    session: ClientSession,
  ) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException();
    }

    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      user.set(updateUserDto);
      await user.save({ session });
    } catch {
      throw new InternalServerErrorException();
    }

    return user;
  }

  async updateAvatar(
    user_id: Types.ObjectId,
    avatar: string,
    avatar_height: number,
    avatar_width: number,
    session: ClientSession,
  ) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: user_id },
        {
          avatar: avatar,
          avatar_height: avatar_height,
          avatar_width: avatar_width,
        },
        { new: true, session },
      );

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async updateTopicsOfUser(
    user_id: Types.ObjectId,
    updateTopic: UpdateUserTopicDto,
    session: ClientSession,
  ) {
    try {
      // console.log(updateTopic.topic);
      const user = await this.userModel.findOneAndUpdate(
        { _id: user_id },
        { topics: updateTopic.topic },
        { new: true, session },
      );

      if (!user) {
        throw new NotFoundException();
      }
      // console.log(user);
      return user;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: Types.ObjectId, session: ClientSession) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException();
    }

    try {
      await user.remove({ session });
    } catch {
      throw new InternalServerErrorException();
    }

    return user;
  }

  async saveOrUpdateRefreshToken(
    user_id: Types.ObjectId,
    refreshToken: string,
    refreshTokenExpiry: number,
  ) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: user_id },
        {
          refreshToken: refreshToken,
          refreshTokenExpiry: refreshTokenExpiry,
        },
      );
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteRefreshToken(user_id: Types.ObjectId) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: user_id },
        {
          refreshToken: null,
          refreshTokenExpiry: null,
        },
      );
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch {
      throw new InternalServerErrorException();
    }
  }

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
      // console.log('all post', allPost);

      return posts;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

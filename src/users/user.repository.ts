import { ConflictException, forwardRef, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateUserTopicDto } from './dto/updateTopic.dto';
import { UpdateRefreshTokenDto } from './dto/updateRefreshToken.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { SearchUserDto } from './dto/searchUser.dto';
import { Post } from 'src/posts/entities/post.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Follow } from 'src/follows/entities/follow.entity';
import { Inject } from '@nestjs/common';
import * as sizeOf from 'image-size';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import * as regex from './untils/regex';

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
    follow.map(item => {
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
    following.map(item => {
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
      postOfUser.map(post => {
        createdImages.push({
          id: post._id + '',
          name: post.name,
          src: '/uploads/' + post.image,
          height: post.image_height,
          width: post.image_width,
        });
      });

      topics = user.topics;

      albumsOfUser = await this.albumModel.find({ user_id: user._id + '' }).populate('post_id');

      albumsOfUser.map(album => {
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
    const newUser = await this.userModel.findByIdAndUpdate(user.id, { userName: userName }, { new: true });

    try {
      await album.save({ session });
      await newUser.save({ session });
      return newUser;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: Types.ObjectId, updateUserDto: UpdateUserDto, session: ClientSession) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException();
    }

    try {
      user.set(updateUserDto);
      await user.save({ session });
    } catch {
      throw new InternalServerErrorException();
    }

    return user;
  }

  async updateAvatar(user_id: Types.ObjectId, avatar: string, avatar_height: number, avatar_width: number, session: ClientSession) {
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

  async updateTopicsOfUser(user_id: Types.ObjectId, updateTopic: UpdateUserTopicDto, session: ClientSession) {
    try {
      // console.log(updateTopic.topic);
      const user = await this.userModel.findOneAndUpdate({ _id: user_id }, { topics: updateTopic.topic }, { new: true, session });

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

  async saveOrUpdateRefreshToken(user_id: Types.ObjectId, refreshToken: string, refreshTokenExpiry: number) {
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

  async home(user_id: Types.ObjectId, topicHome) {
    // get topic of user
    try {
      if (topicHome[0] == 'all') {
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
        let posts: any = await this.postModel
          .find({
            topic: { $in: topic },
          })
          .lean()
          .exec();
        // console.log('post topic', posts);
        posts.map((post: any) => {
          post.id = post._id;
          post.src = `/uploads/${post.image}`;
          post.width = post.image_width;
          post.height = post.image_height;

          delete post.image_height;
          delete post.image_width;
          delete post._id;
        });
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

        follows.map(follow => {
          userFollows.push(follow.followed_user_id._id + '');
        });
        // console.log('userFollows: ', userFollows);

        // get all post of user follow
        for (let i = 0; i < userFollows.length; i++) {
          let post = await this.postModel
            .find({
              user_id: userFollows[i],
            })
            .lean()
            .exec();
          for (let i = 0; i < post.length; i++) {
            postOfUserFollow.push(post[i]);
          }
        }

        postOfUserFollow.map((post: any) => {
          post.id = post._id;
          post.src = `/uploads/${post.image}`;
          post.width = post.image_width;
          post.height = post.image_height;

          delete post.image_height;
          delete post.image_width;
          delete post._id;
        });

        // console.log('postFollow', postOfUserFollow);
        posts.concat(postOfUserFollow);

        posts = _.shuffle(posts);
        // console.log(posts);

        // find all post
        let allPost: any = await this.postModel.find().lean().exec();

        allPost.map((post: any) => {
          post.id = post._id;
          post.src = `/uploads/${post.image}`;
          post.width = post.image_width;
          post.height = post.image_height;

          delete post.image_height;
          delete post.image_width;
          delete post._id;
        });

        // console.log(allPost);

        // console.log(allPost);
        allPost.map(post => {
          posts.push(post);
        });

        // console.log(posts);
        // Array to keep track of duplicates
        var dups = [];
        posts = posts.filter(function (el) {
          // If it is not a duplicate, return true
          if (dups.indexOf(el.id + '') == -1) {
            dups.push(el.id + '');
            return true;
          }

          return false;
        });

        return posts;
      } else {
        let posts = await this.postModel
          .find({
            topic: { $in: topicHome },
          })
          .lean()
          .exec();

        posts = _.shuffle(posts);

        posts.map((post: any) => {
          post.id = post._id;
          post.src = `/uploads/${post.image}`;
          post.width = post.image_width;
          post.height = post.image_height;

          delete post.image_height;
          delete post.image_width;
          delete post._id;
        });
        return posts;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchUser(searchDto: SearchUserDto) {
    try {
      let user1 = await this.userModel
        .find({
          $or: [
            { fullName: { $regex: regex.diacriticSensitiveRegex(`${searchDto.user}`), $options: 'i' } },
            { userName: { $regex: regex.diacriticSensitiveRegex(`${searchDto.user}`), $options: 'i' } },
            { fullName: { $regex: regex.accentsTidy(`${searchDto.user}`), $options: 'i' } },
            { userName: { $regex: regex.accentsTidy(`${searchDto.user}`), $options: 'i' } },
          ],
        })
        .collation({ locale: 'en', strength: 1 })
        .select('-password -refreshToken -__v -refreshTokenExpiry -createdAt -updatedAt')
        .lean()
        .exec();

      // console.log(regex.accentsTidy(`${searchDto.user}`));
      let users = [];
      user1.map(user => {
        users.push({
          id: user._id,
          avatarSrc: `/uploads/${user.avatar}`,
          fullName: user.fullName,
          userName: user.userName,
        });
      });
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

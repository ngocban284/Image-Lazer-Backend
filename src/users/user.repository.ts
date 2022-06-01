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
import { UpdateRefreshTokenDto } from './dto/updateRefreshToken.dto';
import { Post } from 'src/posts/entities/post.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Inject } from '@nestjs/common';
import * as sizeOf from 'image-size';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
  ) { }

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
    let createdImages = [];
    let nameAlbums = [];
    let imageAlbums = [];
    let albumsOfUser;
    let albums = [];
    try {
      user = await this.userModel.findOne({ userName });
      // console.log('user', user);
      postOfUser = await this.postModel.find({ user_id: user._id });
      // console.log('postOfUser', postOfUser);
      postOfUser.map((post) => {
        createdImages.push({
          name: post.name,
          src: '/uploads/' + post.image,
          height: post.image_height,
          width: post.image_width,
        });
      });
      // console.log('createdImage', createdImages);

      albumsOfUser = await this.albumModel
        .find({ user_id: user._id })
        .populate('post_id');
      // console.log('album of user', albumsOfUser);
      // console.log('createdImage', createdImages);
      albumsOfUser.map((album) => {
        // console.log(album);
        nameAlbums.push(album.name);
        // console.log(album.post_id.length);
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
          // console.log(albums);
        } else {
          albums.push({
            id: album._id,
            name: album.name,
            image: null,
          });
        }
      });
      // console.log(imageAlbums);
      // console.log('createdImage', createdImages);
    } catch {
      throw new InternalServerErrorException();
    }
    return { user, createdImages, albums };
    // return albumsOfUser;
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
    const allUser = await this.getAllUsers();

    userName = userName + '_' + allUser.length;
    // console.log(userName);
    await user.save();
    const newUser = await this.userModel.findByIdAndUpdate(
      user.id,
      { userName: userName },
      { new: true },
    );

    try {
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
    let user = await this.getUserById(id);

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

  async updateAvatar(
    user_id: Types.ObjectId,
    avatar: string,
    avatar_height: number,
    avatar_width: number,
    session: ClientSession,
  ) {
    try {
      let user = await this.userModel.findOneAndUpdate(
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

  async deleteUser(id: Types.ObjectId, session: ClientSession) {
    let user = await this.getUserById(id);

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
      let user = await this.userModel.findOneAndUpdate(
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
      let user = await this.userModel.findOneAndUpdate(
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
}

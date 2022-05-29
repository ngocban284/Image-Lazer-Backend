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

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
  ) {}

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
      postOfUser = await this.postModel.find({ user_id: user._id });

      postOfUser.map((post) => {
        createdImages.push(post.image);
      });
      albumsOfUser = await this.albumModel
        .find({ user_id: user._id })
        .populate('post_id');

      albumsOfUser.map((album) => {
        nameAlbums.push(album.name);
        imageAlbums.push(album.post_id[album.post_id.length - 1].image);
        albums.push({
          id: album._id,
          name: album.name,
          image: album.post_id[album.post_id.length - 1].image,
          image_height: album.post_id[album.post_id.length - 1].image_height,
          image_width: album.post_id[album.post_id.length - 1].image_width,
        });
      });
    } catch {
      throw new InternalServerErrorException();
    }
    // return albumsOfUser;
    return { user, createdImages, albums };
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

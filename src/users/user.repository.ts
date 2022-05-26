import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateRefreshTokenDto } from './dto/updateRefreshToken.dto';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
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

  async getUserById(id: Types.ObjectId) {
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
    try {
      user = await this.userModel.findOne({ userName });
    } catch {
      throw new InternalServerErrorException();
    }
    return user;
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
    session: ClientSession,
  ) {
    try {
      let user = await this.userModel.findOneAndUpdate(
        { _id: user_id },
        {
          avatar: avatar,
        },
        { new: true },
      );
      if (!user) {
        throw new NotFoundException();
      }

      await user.save({ session });
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

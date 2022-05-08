import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

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

  async getUserById(id: MongoSchema.Types.ObjectId) {
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

  async createUser(createUserDto: CreateUserDto, session: ClientSession) {
    let user = await this.getUserByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('Email already exists');
    }

    console.log(createUserDto);
    user = new this.userModel({
      ...createUserDto,
    });
    console.log(user);

    try {
      await user.save({ session });
    } catch {
      throw new InternalServerErrorException();
    }

    return user;
  }

  async updateUser(
    id: MongoSchema.Types.ObjectId,
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

  async deleteUser(id: MongoSchema.Types.ObjectId, session: ClientSession) {
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
}

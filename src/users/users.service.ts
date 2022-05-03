import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema } from 'mongoose';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }

  async getUserById(id: MongoSchema.Types.ObjectId) {
    return await this.userRepository.getUserById(id);
  }

  async createUser(createUserDto: CreateUserDto, session: ClientSession) {
    return await this.userRepository.createUser(createUserDto, session);
  }

  async updateUser(
    id: MongoSchema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
    session: ClientSession,
  ) {
    return await this.userRepository.updateUser(id, updateUserDto, session);
  }

  async deleteUser(id: MongoSchema.Types.ObjectId, session: ClientSession) {
    return await this.userRepository.deleteUser(id, session);
  }
}

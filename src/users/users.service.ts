import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtPayload } from './jwt-payload.interface';
import { LogInUserDto } from './dto/loginUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

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

  async login(logInUserDto: LogInUserDto) {
    const { email, password } = logInUserDto;
    const user = await this.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email, userId: user._id };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
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

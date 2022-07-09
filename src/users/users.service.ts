import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateUserTopicDto } from './dto/updateTopic.dto';
import { SearchUserDto } from './dto/searchUser.dto';
import { JwtPayload } from './jwt/interfaces/jwt-payload.interface';
import { LogInUserDto } from './dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { UpdateRefreshTokenDto } from './dto/updateRefreshToken.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
const currentTime = moment();

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository, private jwtService: JwtService) {}

  async attachFollower(user_id: Types.ObjectId) {
    return await this.userRepository.attachFollower(user_id);
  }

  async attachFollowing(user_id: Types.ObjectId) {
    return await this.userRepository.attachFollowing(user_id);
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }

  async getUserById(id: Types.ObjectId) {
    return await this.userRepository.getUserById(id);
  }

  async getUserByUserName(userName: string) {
    return await this.userRepository.getUserByUserName(userName);
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
      const generateRefreshToken = await this.generateRefreshToken(user._id);
      return { accessToken, refreshToken: generateRefreshToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async changePassword(id: Types.ObjectId, changePasswordDto: ChangePasswordDto, session: ClientSession) {
    const user = await this.userRepository.getUserById(id);
    if (user && (await bcrypt.compare(changePasswordDto.oldPassword, user.password))) {
      return await this.userRepository.updateUser(id, { password: changePasswordDto.newPassword }, session);
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async updateUser(id: Types.ObjectId, updateUserDto: UpdateUserDto, session: ClientSession) {
    return await this.userRepository.updateUser(id, updateUserDto, session);
  }

  async updateAvatar(user_id: Types.ObjectId, avatar: string, avatar_height: number, avatar_width: number, session: ClientSession) {
    return await this.userRepository.updateAvatar(user_id, avatar, avatar_height, avatar_width, session);
  }

  async updateTopicsOfUser(user_id: Types.ObjectId, updateTopic: UpdateUserTopicDto, session: ClientSession) {
    return await this.userRepository.updateTopicsOfUser(user_id, updateTopic, session);
  }

  async deleteUser(id: Types.ObjectId, session: ClientSession) {
    return await this.userRepository.deleteUser(id, session);
  }

  async generateRefreshToken(user_id: Types.ObjectId) {
    const refreshtoken = this.jwtService.sign({ user_id }, { expiresIn: '3d' });
    // console.log(currentTime.unix());
    const payload: any = this.jwtService.decode(refreshtoken);
    // console.log(payload.exp, typeof payload.exp);
    await this.userRepository.saveOrUpdateRefreshToken(user_id, refreshtoken, payload.exp);
    return refreshtoken;
  }

  async deleteRefreshToken(user_id: Types.ObjectId) {
    return await this.userRepository.deleteRefreshToken(user_id);
  }

  async home(user_id: Types.ObjectId) {
    return await this.userRepository.home(user_id);
  }

  async searchUser(searchUserDto: SearchUserDto) {
    return await this.userRepository.searchUser(searchUserDto);
  }
}

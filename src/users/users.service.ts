import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtPayload } from './jwt/interfaces/jwt-payload.interface';
import { LogInUserDto } from './dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { UpdateRefreshTokenDto } from './dto/updateRefreshToken.dto';
const currentTime = moment();

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

  async getUserById(id: Types.ObjectId) {
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
      const generateRefreshToken = await this.generateRefreshToken(user._id);
      return { accessToken, refreshToken: generateRefreshToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async updateUser(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
    session: ClientSession,
  ) {
    return await this.userRepository.updateUser(id, updateUserDto, session);
  }

  async deleteUser(id: Types.ObjectId, session: ClientSession) {
    return await this.userRepository.deleteUser(id, session);
  }

  async generateRefreshToken(user_id: Types.ObjectId) {
    const refreshtoken = this.jwtService.sign({ user_id }, { expiresIn: '3d' });
    console.log(currentTime.unix());
    const payload: any = this.jwtService.decode(refreshtoken);
    // console.log(payload.exp, typeof payload.exp);
    await this.userRepository.saveOrUpdateRefreshToken(
      user_id,
      refreshtoken,
      payload.exp,
    );
    return refreshtoken;
  }

  async deleteRefreshToken(user_id: Types.ObjectId) {
    return await this.userRepository.deleteRefreshToken(user_id);
  }
}

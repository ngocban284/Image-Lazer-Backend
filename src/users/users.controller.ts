import {
  Body,
  Res,
  HttpStatus,
  Param,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Schema as MongoSchema, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LogInUserDto } from './dto/loginUser.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllUsers(@Res() res: Response) {
    const users = await this.usersService.getAllUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async getUserById(
    @Param('id') id: MongoSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getUserById(id);
    return res.status(HttpStatus.OK).json(user);
  }

  @Post('/auth/signup')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    console.log(createUserDto);
    try {
      const user = await this.usersService.createUser(createUserDto, session);
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(user);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Post('/auth/signin')
  signIn(@Body() logInUserDto: LogInUserDto) {
    return this.usersService.login(logInUserDto);
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  async updateUser(
    @Param('id') id: MongoSchema.Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const user = await this.usersService.updateUser(
        id,
        updateUserDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).json(user);
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteUser(
    @Param('id') id: MongoSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const user = await this.usersService.deleteUser(id, session);
      await session.commitTransaction();
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: 'succesfully deleted' });
    } catch {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  }
}

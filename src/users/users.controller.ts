import {
  Body,
  Res,
  HttpStatus,
  Param,
  Controller,
  Delete,
  Get,
  Put,
  Post,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { Connection, Schema as MongoSchema } from 'mongoose';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly mongoConnection: Connection,
    private usersService: UsersService,
  ) {}

  @Get()
  async getAllUsers(@Res() res: Response) {
    const users = await this.usersService.getAllUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  @Get('/:id')
  async getUserById(
    @Param('id') id: MongoSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getUserById(id);
    return res.status(HttpStatus.OK).json(user);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
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

  @Patch('/:id')
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

import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthSocketMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: (socketError?: Error) => void) {
    try {
      const { user_id } = this.jwtService.verify(req.cookies.refreshToken);
      const user = await this.usersService.getUserById(user_id);
      req.user = user;
    } catch (error) {
      const socketError = new Error('NOT_AUTHORIZED');
      return next(socketError);
    }
    next();
  }
}

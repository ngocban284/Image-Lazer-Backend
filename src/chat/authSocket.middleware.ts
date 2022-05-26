import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthSocketMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: (socketError?: Error) => void) {
    try {
      const decoded = this.jwtService.decode(
        Object.values(req.cookies).toString(),
      );
      req.user = decoded;
    } catch (error) {
      const socketError = new Error('NOT_AUTHORIZED');
      return next(socketError);
    }
    next();
  }
}

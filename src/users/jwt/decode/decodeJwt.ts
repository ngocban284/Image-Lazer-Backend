import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export class DecodeJwt {
  constructor(private jwtService: JwtService) {}

    async decodeJwt(payload:JwtPayload) {

    }
}


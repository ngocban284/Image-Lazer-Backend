import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/user.repository';
import * as moment from 'moment';

const currentTime = moment().unix();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User> {
    const { email } = payload;

    // console.log(payload, typeof payload.exp);
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    // console.log(currentTime);
    if (payload.exp < currentTime) {
      if (user.refreshTokenExpiredAt < currentTime) {
        throw new UnauthorizedException();
      } else {
        await this.userRepository.deleteRefreshToken(user._id);
        return user;
      }
    }

    return user;
  }
}

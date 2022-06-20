/*
https://docs.nestjs.com/providers#services
*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { HomeRepositoty } from './home.repositoty';

import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
@Injectable()
export class HomeService {
  constructor(private readonly homeRepository: HomeRepositoty) {}

  async home(user_id: Types.ObjectId) {
    return await this.homeRepository.home(user_id);
  }
}

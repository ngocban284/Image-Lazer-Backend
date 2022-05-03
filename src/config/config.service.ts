/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    const result = dotenv.config();
    if (result.error) {
      throw result.error;
    } else {
      this.envConfig = result.parsed;
    }
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public getPortConfig() {
    return this.get('PORT');
  }

  public getMongoConfig() {
    return {
      uri:
        'mongodb+srv://' +
        this.get('MONGO_USER') +
        ':' +
        this.get('MONGO_PASSWORD') +
        '@' +
        this.get('MONGO_HOST') +
        '/' +
        this.get('MONGO_DATABASE') +
        '?retryWrites=true&w=majority',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
}

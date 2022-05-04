/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { FollowRepository } from './follows.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowSchema, Follow } from './entities/follow.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
  ],
  controllers: [FollowsController],
  providers: [FollowsService, FollowRepository],
  exports: [FollowsService, FollowRepository],
})
export class FollowsModule {}

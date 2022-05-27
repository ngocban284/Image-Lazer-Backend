/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { FollowRepository } from './follows.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowSchema, Follow } from './entities/follow.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
  ],
  controllers: [FollowsController],
  providers: [FollowsService, FollowRepository],
  exports: [FollowsService, FollowRepository, MongooseModule],
})
export class FollowsModule {}

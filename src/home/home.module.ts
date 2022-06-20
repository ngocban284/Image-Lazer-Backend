/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { FollowsModule } from 'src/follows/follows.module';
import { PostsModule } from 'src/posts/posts.module';

import { HomeControllerController } from './home.controller';
import { HomeRepositoty } from './home.repositoty';
import { HomeService } from './home.service';

@Module({
  imports: [UsersModule, FollowsModule, PostsModule],
  controllers: [HomeControllerController],
  providers: [HomeRepositoty, HomeService],
  exports: [HomeRepositoty],
})
export class HomeModule {}

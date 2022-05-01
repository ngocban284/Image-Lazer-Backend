import { PostsService } from './posts.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [PostsService],
})
export class PostsModule {}

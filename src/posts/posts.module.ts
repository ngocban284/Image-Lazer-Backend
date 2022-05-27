/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostRepository } from './posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';

import { FollowsModule } from 'src/follows/follows.module';
import { LikesModule } from 'src/likes/likes.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    FollowsModule,
    LikesModule,
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
  exports: [PostsService, PostRepository, MongooseModule],
})
export class PostsModule {}

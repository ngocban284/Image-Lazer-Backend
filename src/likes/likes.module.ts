/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Like, LikeSchema } from './entities/like.entity';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { LikeRepository } from './likes.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [LikesController],
  providers: [LikesService, LikeRepository],
  exports: [LikesService, LikeRepository],
})
export class LikesModule {}

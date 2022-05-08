/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { savePostSchema, SavePost } from './entities/savepost.entity';
import { SavePostRepository } from './saveposts.repository';
import { SavePostController } from './saveposts.controller';
import { SavePostService } from './saveposts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavePost.name, schema: savePostSchema },
    ]),
  ],
  controllers: [SavePostController],
  providers: [SavePostService, SavePostRepository],
  exports: [SavePostService, SavePostRepository],
})
export class SavePostsModule {}

/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { savePostSchema, SavePost } from './entities/savepost.entity';
import { SavePostRepository } from './saveposts.repository';
import { SavePostController } from './saveposts.controller';
import { SavePostService } from './saveposts.service';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavePost.name, schema: savePostSchema },
    ]),
    forwardRef(() => AlbumsModule),
  ],
  controllers: [SavePostController],
  providers: [SavePostService, SavePostRepository],
  exports: [SavePostService, SavePostRepository, MongooseModule],
})
export class SavePostsModule {}

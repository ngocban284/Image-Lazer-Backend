import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './entities/album.entity';
import { AlbumRepository } from './albums.repository';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { SavePostsModule } from 'src/savePosts/saveposts.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    SavePostsModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumRepository],
  exports: [AlbumsService, AlbumRepository, MongooseModule],
})
export class AlbumsModule {}

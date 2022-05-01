import { AlbumsService } from './albums.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [AlbumsService],
})
export class AlbumsModule {}

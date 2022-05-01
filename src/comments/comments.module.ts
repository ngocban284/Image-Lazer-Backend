import { CommentsService } from './comments.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [CommentsService],
})
export class CommentsModule {}

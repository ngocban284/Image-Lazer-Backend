import { CommentModule } from './comment/comment.module';
import { Module } from '@nestjs/common';
import { ImageCommentsModule } from './imageComments/imageComments.module';

@Module({
  imports: [CommentModule, ImageCommentsModule],
  exports: [CommentModule, ImageCommentsModule],
})
export class CommentsModule {}

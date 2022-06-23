import { ImageCommentsModule } from './../imageComments/imageComments.module';
import { Comment1, Comment1Schema } from '../comment/entities/comment.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentGateway } from './comment.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment1.name, schema: Comment1Schema },
    ]),
    ImageCommentsModule,
  ],
  providers: [CommentGateway, CommentService],
  exports: [MongooseModule],
})
export class CommentModule {}

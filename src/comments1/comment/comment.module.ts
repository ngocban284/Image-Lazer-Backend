import { PostsModule } from './../../posts/posts.module';
import { ChatModule } from './../../chat/chat.module';
import { UsersModule } from './../../users/users.module';
import { ImageCommentsModule } from './../imageComments/imageComments.module';
import { Comment1, Comment1Schema } from '../comment/entities/comment.entity';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentGateway } from './comment.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment1.name, schema: Comment1Schema },
    ]),
    ImageCommentsModule,
    UsersModule,
    ChatModule,
    PostsModule,
  ],
  providers: [CommentGateway, CommentService],
  exports: [CommentGateway, CommentService, MongooseModule],
})
export class CommentModule {}

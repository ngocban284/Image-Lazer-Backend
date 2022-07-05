import {
  ImageComments,
  ImageCommentsSchema,
} from './entities/imageComments.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageCommentsService } from './imageComments.service';
import { ImageCommentsGateway } from './imageComments.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageComments.name, schema: ImageCommentsSchema },
    ]),
  ],
  providers: [ImageCommentsGateway, ImageCommentsService],
  exports: [MongooseModule],
})
export class ImageCommentsModule {}

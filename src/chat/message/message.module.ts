import { ConversationModule } from './../conversation/conversation.module';
import { Message, MessageSchema } from './entities/message.entity';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ConversationModule,
  ],
  providers: [MessageGateway, MessageService],
  exports: [MessageGateway, MessageService, MongooseModule],
})
export class MessageModule {}

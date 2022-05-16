import { ConversationModule } from './../conversation/conversation.module';
import { Message, MessageSchema } from './entities/message.entity';
import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from '../chat.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ConversationModule,
    UsersModule,
    forwardRef(() => ChatModule),
  ],
  providers: [MessageGateway, MessageService],
  exports: [MessageGateway, MessageService, MongooseModule],
})
export class MessageModule {}

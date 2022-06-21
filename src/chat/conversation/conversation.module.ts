import { UsersModule } from 'src/users/users.module';
import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './entities/conversation.entity';
import { ConversationController } from './conversation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    UsersModule,
  ],
  providers: [ConversationGateway, ConversationService],
  controllers: [ConversationController],
  exports: [ConversationGateway, ConversationService, MongooseModule],
})
export class ConversationModule {}

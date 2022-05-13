import { ChatService } from './chat.service';
import { MessageModule } from './message/message.module';
import { FriendInvitationModule } from './friend-invitation/friend-invitation.module';
import { ConversationModule } from './conversation/conversation.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [FriendInvitationModule, ConversationModule, MessageModule],
  providers: [ChatGateway, ChatService],
  exports: [
    ChatGateway,
    ChatService,
    FriendInvitationModule,
    ConversationModule,
    MessageModule,
  ],
})
export class ChatModule {}

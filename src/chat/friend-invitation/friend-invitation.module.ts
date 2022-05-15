import { FollowsModule } from './../../follows/follows.module';
import { ChatService } from './../chat.service';
import { ChatModule } from './../chat.module';
import { UsersModule } from './../../users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { FriendInvitationService } from './friend-invitation.service';
import { FriendInvitationGateway } from './friend-invitation.gateway';
import { FollowRepository } from 'src/follows/follows.repository';

@Module({
  imports: [UsersModule, FollowsModule, forwardRef(() => ChatModule)],
  providers: [FriendInvitationGateway, FriendInvitationService],
})
export class FriendInvitationModule {}

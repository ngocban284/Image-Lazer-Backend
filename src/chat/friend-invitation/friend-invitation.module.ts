import { Module } from '@nestjs/common';
import { FriendInvitationService } from './friend-invitation.service';
import { FriendInvitationGateway } from './friend-invitation.gateway';

@Module({
  providers: [FriendInvitationGateway, FriendInvitationService],
})
export class FriendInvitationModule {}

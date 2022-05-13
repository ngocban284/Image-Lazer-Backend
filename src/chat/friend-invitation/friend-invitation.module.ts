import { Module } from '@nestjs/common';
import { FriendInvitationService } from './friend-invitation.service';
import { FriendInvitationController } from './friend-invitation.controller';

@Module({
  providers: [FriendInvitationService],
  controllers: [FriendInvitationController]
})
export class FriendInvitationModule {}

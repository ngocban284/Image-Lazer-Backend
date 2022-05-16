import { FollowsModule } from '../../follows/follows.module';
import { ChatService } from '../chat.service';
import { ChatModule } from '../chat.module';
import { UsersModule } from '../../users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { UserFollowingService } from './user-following.service';
import { UserFollowingGateway } from './user-following.gateway';
import { FollowRepository } from 'src/follows/follows.repository';

@Module({
  imports: [UsersModule, FollowsModule, forwardRef(() => ChatModule)],
  providers: [UserFollowingGateway, UserFollowingService],
})
export class UserFollowingModule {}

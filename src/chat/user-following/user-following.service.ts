import { Server } from 'socket.io';
import { ChatGateway } from '../chat.gateway';
import { FollowRepository } from '../../follows/follows.repository';
import { ChatService } from '../chat.service';
import { UserRepository } from '../../users/user.repository';
import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserFollowingService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly chatService: ChatService,
    private readonly followRepository: FollowRepository,
  ) {}

  @WebSocketServer() server: Server;

  updateFriends = async (userId: string) => {
    try {
      const receiverList = this.chatService.getActiveConnections(userId);

      if (receiverList.length > 0) {
        const user = await this.followRepository.followingByUser(userId);

        // console.log(user);
        if (user) {
          const followsUserList = user.map((followUser) => {
            return {
              id: followUser.followed_user_id._id,
              email: followUser.followed_user_id['email'].toString(),
              username: followUser.followed_user_id['userName'].toString(),
            };
          });
          receiverList.forEach((receiverClientId) => {
            this.server.to(receiverClientId).emit('follows-list', {
              followsUser: followsUserList ? followsUserList : [],
            });
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}

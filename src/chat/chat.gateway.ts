import { UserFollowingService } from './user-following/user-following.service';
import { ChatService } from './chat.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly userFollowingService: UserFollowingService,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('ChatGateWay');

  afterInit(client: Socket) {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    const clientId = client.id.toString();
    const user = await this.chatService.currentUserId(
      client.handshake.auth.token,
    );
    if (!user) {
      return this.disconnect(client);
    }
    client.data.user = user;
    const userId = user.user_id.toString();
    this.logger.log(`User connected ${client.id}`);
    this.chatService.addNewConnectedUser({ clientId, userId });
    // this.userFollowingService.updateFriends(userId);
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id.toString();
    this.logger.log(`User disconnect ${client.id}`);
    this.chatService.removeConnectedUser(clientId);
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }

  getSocketServerInstance = () => {
    return this.server;
  };
}

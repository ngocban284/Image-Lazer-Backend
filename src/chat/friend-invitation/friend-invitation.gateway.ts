import { FriendInvitationService } from './friend-invitation.service';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendInvitationGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly friendInvitationService: FriendInvitationService,
  ) {}

  @SubscribeMessage('test')
  test(@MessageBody() a: string, @ConnectedSocket() client: Socket) {
    console.log(a, client.id);
  }
}

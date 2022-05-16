import { UserFollowingService } from './user-following.service';
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
export class UserFollowingGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly userFollowingService: UserFollowingService) {}

  // @SubscribeMessage('test')
  // test(@MessageBody() a: string, @ConnectedSocket() client: Socket) {
  //   console.log(a, client.id);
  // }
}

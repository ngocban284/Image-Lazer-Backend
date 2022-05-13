import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateWay');

  afterInit(client: Socket) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    const clientId = client.id.toString();
    const userId = 'irene';
    this.logger.log(`User connected ${client.id}`);
    this.chatService.addNewConnectedUser({ clientId, userId });
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id.toString();
    this.logger.log(`User disconnect ${client.id}`);
    this.chatService.removeConnectedUser(clientId);
  }
}

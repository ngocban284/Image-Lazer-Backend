import { DirectChatHistoryDto } from './dto/direct-chat-history.dto';
import { MessageService } from './message.service';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DirectMessageDto } from './dto/direct-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('directMessage')
  directMessage(
    @MessageBody() data: DirectMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.messageService.directMessageHandler(client, data);
  }

  @SubscribeMessage('directChatHistory')
  directChatHistory(
    @MessageBody() data: DirectChatHistoryDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.messageService.directChatHistoryHandler(client, data);
  }
}

import { UpdateReceiverConversationDto } from './dto/updateReceiverConversation.dto';
import { ConversationService } from './conversation.service';

import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ConversationGateway {
  // constructor(private readonly conversationService: ConversationService) {}
  // @WebSocketServer()
  // server: Server;
  // @SubscribeMessage('updateReceiverConversation')
  // updateReceiverConversation(
  //   // @MessageBody() data: UpdateReceiverConversationDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   this.conversationService.updateReceiverConversationHandler(client);
  // }
}

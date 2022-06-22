/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
// import { CreateCommentDto } from './dto/createComment.dto';
// import { UpdateCommentDto } from './dto/updateComment.dto';
import { Comment } from './entities/comment.entity';

@WebSocketGateway({ namespace: 'comments', cors: { origin: '*' } })
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger('CommentsGateway');

  @SubscribeMessage('Comment')
  async onCreateComment(@MessageBody() data: Comment) {
    this.logger.log(`createComment: ${JSON.stringify(data)}`);
    this.server.emit('createComment', data);
  }

  async onUpdateComment(@MessageBody() data: Comment) {
    this.logger.log(`updateComment: ${JSON.stringify(data)}`);
    this.server.emit('updateComment', data);
  }

  async onDeleteComment(@MessageBody() data: Comment) {
    this.logger.log(`deleteComment: ${JSON.stringify(data)}`);
    this.server.emit('deleteComment', data);
  }

  async handleConnection() {
    this.logger.log('New client connected');
  }

  async handleDisconnect() {
    this.logger.log('Client disconnected');
  }

  async afterInit(server: Server) {
    this.logger.log('Init ChatGateway');
  }

  async handleError(error: any) {
    this.logger.log(error);
  }
}

import { DirectCommentHistoryDto } from './dto/direct-comment-history.dto';
import { Server, Socket } from 'socket.io';
import { CommentService } from './comment.service';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DirectCommentDto } from './dto/direct-comment.dto';
import { DirectNotificationCommentDto } from './dto/direct-notification-comment.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentGateway {
  constructor(private readonly commentService: CommentService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('directComment')
  directComment(
    @MessageBody() data: DirectCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.commentService.directCommentHandler(client, data);
  }

  @SubscribeMessage('directCommentHistory')
  directCommentHistory(@MessageBody() data: DirectCommentHistoryDto) {
    this.commentService.directCommentHistoryHandler(data);
  }

  @SubscribeMessage('directNotificationComment')
  directNotificationComment(
    @MessageBody() data: DirectNotificationCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.commentService.directNotificationComment(client, data);
  }

  @SubscribeMessage('deleteNotification')
  deleteNotification(@ConnectedSocket() client: Socket) {
    this.commentService.deleteNotification(client);
  }
}

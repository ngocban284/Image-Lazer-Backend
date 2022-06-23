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
    console.log('directCommentHistory', data);
    this.commentService.directCommentHistoryHandler(data);
  }
}

import { Socket } from 'socket.io';
import { Response } from 'express';
import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/receiver/:receiverUserId') // get all conversations
  async getConversationToReceiverUserId(
    @Res() res: Response,
    @Param('receiverUserId') receiverUserId: string,
  ) {
    const users =
      await this.conversationService.updateReceiverConversationHandler(
        receiverUserId,
      );
    return res.status(HttpStatus.OK).json(users);
  }
}

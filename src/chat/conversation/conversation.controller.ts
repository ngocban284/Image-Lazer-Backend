import { Response } from 'express';
import { Body, Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/receiver/:receiverUserId') // get all conversations
  async updateReceiverConversationHandler(
    @Res() res: Response,
    @Param('receiverUserId') receiverUserId: string,
  ) {
    const users =
      await this.conversationService.updateReceiverConversationHandler(
        receiverUserId,
      );
    return res.status(HttpStatus.OK).json(users);
  }

  @Get()
  async getConversationToReceiverUserId(
    @Body('receiverUserId') receiverUserId: string,
  ) {
    return this.conversationService.getConversationToReceiverUserId(
      receiverUserId,
    );
  }
}

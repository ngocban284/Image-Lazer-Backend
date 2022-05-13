import { AddNewConnectedUserDto } from './dto/add-new-connected.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
  private logger: Logger = new Logger('ChatGateWay');
  private connectedUsers = new Map();

  addNewConnectedUser = (addNewConnectedUserDto: AddNewConnectedUserDto) => {
    const { clientId, userId } = addNewConnectedUserDto;
    this.connectedUsers.set(clientId, { userId });
    this.logger.log('new connected users');
    console.log(this.connectedUsers);
  };

  removeConnectedUser = (clientId: string) => {
    if (this.connectedUsers.has(clientId)) {
      this.connectedUsers.delete(clientId);
      this.logger.log('new connected users');
      console.log(this.connectedUsers);
    }
  };
}

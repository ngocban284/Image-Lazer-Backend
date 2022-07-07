import { JwtService } from '@nestjs/jwt';
import { AddNewConnectedUserDto } from './dto/add-new-connected.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(private readonly jwtService: JwtService) {}
  private logger: Logger = new Logger('ChatGateWay');
  private connectedUsers = new Map();

  currentUserId = async (token: string) => {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch (error) {
      new Error('NOT_AUTHORIZED');
    }
  };

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

  getActiveConnections = (userId: string) => {
    const activeConnections = [];

    this.connectedUsers.forEach(function (value, key) {
      if (value.userId === userId) {
        activeConnections.push(key);
      }
    });

    return activeConnections;
  };

  getActiveConnectionOfUser = (userId: string) => {
    let clientId = '';
    this.connectedUsers.forEach(function (value, key) {
      if (value.userId === userId) {
        clientId = key;
      }
    });
    return clientId;
  };
}

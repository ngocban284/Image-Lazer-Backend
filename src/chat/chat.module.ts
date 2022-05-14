import { UsersModule } from 'src/users/users.module';
import { UserRepository } from 'src/users/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { MessageModule } from './message/message.module';
import { FriendInvitationModule } from './friend-invitation/friend-invitation.module';
import { ConversationModule } from './conversation/conversation.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthSocketMiddleware } from './authSocket.middleware';

@Module({
  imports: [
    FriendInvitationModule,
    ConversationModule,
    MessageModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [ChatGateway, ChatService, UserRepository],
  exports: [
    ChatGateway,
    ChatService,
    FriendInvitationModule,
    ConversationModule,
    MessageModule,
  ],
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthSocketMiddleware).forRoutes('/users/auth/signin');
  }
}

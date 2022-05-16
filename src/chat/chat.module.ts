import { FollowsModule } from './../follows/follows.module';
import { FollowRepository } from './../follows/follows.repository';
import { UserFollowingService } from './user-following/user-following.service';
import { UsersModule } from 'src/users/users.module';
import { UserRepository } from 'src/users/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { MessageModule } from './message/message.module';
import { UserFollowingModule } from './user-following/user-following.module';
import { ConversationModule } from './conversation/conversation.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthSocketMiddleware } from './authSocket.middleware';

@Module({
  imports: [
    UserFollowingModule,
    ConversationModule,
    MessageModule,
    UsersModule,
    FollowsModule,
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
  providers: [
    ChatGateway,
    ChatService,
    UserRepository,
    UserFollowingService,
    FollowRepository,
  ],
  exports: [
    ChatGateway,
    ChatService,
    UserFollowingModule,
    ConversationModule,
    MessageModule,
  ],
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthSocketMiddleware).forRoutes('/users/auth/signin');
  }
}

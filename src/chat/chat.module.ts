import { FollowsModule } from './../follows/follows.module';
import { FollowRepository } from './../follows/follows.repository';
import { UsersModule } from 'src/users/users.module';
import { UserRepository } from 'src/users/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthSocketMiddleware } from './authSocket.middleware';
import { PostsModule } from '../posts/posts.module';
import { AlbumsModule } from '../albums/albums.module';

@Module({
  imports: [
    ConversationModule,
    MessageModule,
    UsersModule,
    PostsModule,
    AlbumsModule,
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
  providers: [ChatGateway, ChatService, UserRepository, FollowRepository],
  exports: [ChatGateway, ChatService, ConversationModule, MessageModule],
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthSocketMiddleware)
      .forRoutes({ path: 'users/auth/signin', method: RequestMethod.POST });
  }
}

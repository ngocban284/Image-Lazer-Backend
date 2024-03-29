import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './entities/user.entity';
import { forwardRef, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt/guards/jwt.guard';
import { JwtStrategy } from './jwt/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { PostsModule } from 'src/posts/posts.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { FollowsModule } from 'src/follows/follows.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => FollowsModule),
    forwardRef(() => PostsModule),
    AlbumsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  providers: [UsersService, UserRepository, JwtGuard, JwtStrategy],
  controllers: [UsersController],
  exports: [
    UsersService,
    UserRepository,
    MongooseModule,
    JwtStrategy,
    PassportModule,
  ],
})
export class UsersModule {}

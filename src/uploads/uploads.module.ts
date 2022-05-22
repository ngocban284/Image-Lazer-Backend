import { UploadsController } from './uploads.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  controllers: [UploadsController],
  providers: [],
})
export class UploadsModule {}

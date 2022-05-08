/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { SavePostRepository } from './saveposts.repository';
import { SavePostDto } from './dto/savepost.dto';

@Injectable()
export class SavePostService {
  constructor(private readonly savePostRepository: SavePostRepository) {}

  async createSavePost(savePostDto: SavePostDto, session: ClientSession) {
    return await this.savePostRepository.createSavePost(savePostDto, session);
  }

  async getSavePost(user_id: Types.ObjectId) {
    return await this.savePostRepository.getSavePost(user_id);
  }

  async getSavePostById(post_id: Types.ObjectId) {
    return await this.savePostRepository.getSavePostById(post_id);
  }

  async deleteSavePost(post_id: Types.ObjectId, session: ClientSession) {
    return await this.savePostRepository.deleteSavePost(post_id, session);
  }
}

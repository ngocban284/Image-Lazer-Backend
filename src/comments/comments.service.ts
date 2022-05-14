/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { CommentRepository } from './comments.repository';
import { GetCommentDto } from './dto/getComment.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(
    user_id: Types.ObjectId,
    commentDto: CreateCommentDto,
    session: ClientSession,
  ) {
    return await this.commentRepository.createComment(
      user_id,
      commentDto,
      session,
    );
  }

  async getComments(getComment: GetCommentDto) {
    return await this.commentRepository.getComment(getComment);
  }

  async updateComment(
    user_id: Types.ObjectId,
    comment_id: Types.ObjectId,
    updateCommentDto: UpdateCommentDto,
    session: ClientSession,
  ) {
    return await this.commentRepository.updateComment(
      user_id,
      comment_id,
      updateCommentDto,
      session,
    );
  }

  async deleteComment(
    user_id: Types.ObjectId,
    comment_id: Types.ObjectId,
    session: ClientSession,
  ) {
    return await this.commentRepository.deleteComment(
      user_id,
      comment_id,
      session,
    );
  }
}

/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongoSchema, Types } from 'mongoose';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/createComment.dto';
import { GetCommentDto } from './dto/getComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(commentDto: CreateCommentDto, session: ClientSession) {
    return await this.commentRepository.createComment(commentDto, session);
  }

  async getComments(getComment: GetCommentDto) {
    return await this.commentRepository.getComment(getComment);
  }

  async updateComment(
    comment_id: Types.ObjectId,
    updateCommentDto: UpdateCommentDto,
    session: ClientSession,
  ) {
    return await this.commentRepository.updateComment(
      comment_id,
      updateCommentDto,
      session,
    );
  }

  async deleteComment(comment_id: Types.ObjectId, session: ClientSession) {
    return await this.commentRepository.deleteComment(comment_id, session);
  }
}

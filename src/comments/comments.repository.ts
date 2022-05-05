import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './entities/comment.entity';
import { Types, ClientSession, Model } from 'mongoose';
import { CreateCommentDto } from './dto/createComment.dto';
import { GetCommentDto } from './dto/getComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async createComment(commentDto: CreateCommentDto, session: ClientSession) {
    try {
      let comment = new this.commentModel(commentDto);
      await comment.save({ session: session });
      return comment;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getComment(getComment: GetCommentDto) {
    try {
      if (getComment.post_id) {
        let comments = await this.commentModel
          .find({ post_id: getComment.post_id })
          .populate('user_id');
        return comments;
      } else {
        let comments = await this.commentModel
          .find({ parentComment_id: getComment.parentComment_id })
          .populate('user_id');
        return comments;
      }
    } catch {
      throw new NotFoundException();
    }
  }

  async updateComment(
    comment_id: Types.ObjectId,
    updateCommentDto: UpdateCommentDto,
    session: ClientSession,
  ) {
    try {
      let comment = await this.commentModel.findByIdAndUpdate(
        comment_id,
        updateCommentDto,
        { new: true, session: session },
      );
      return comment;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteComment(comment_id: Types.ObjectId, session: ClientSession) {
    try {
      let comment = await this.commentModel.findByIdAndDelete(comment_id, {
        session: session,
      });

      return comment;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

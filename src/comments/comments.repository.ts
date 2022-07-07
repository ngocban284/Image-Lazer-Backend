import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, ClientSession, Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { GetCommentDto } from './dto/getComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { CommentsGateway } from './comments.gateway';

export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private commentsGateway: CommentsGateway,
  ) {}

  async createComment(
    user_id: Types.ObjectId,
    commentDto: CreateCommentDto,
    session: ClientSession,
  ) {
    try {
      let comment = new this.commentModel(commentDto, user_id);
      await comment.save({ session: session });
      this.commentsGateway.onCreateComment(comment);
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
    user_id: Types.ObjectId,
    comment_id: Types.ObjectId,
    updateCommentDto: UpdateCommentDto,
    session: ClientSession,
  ) {
    try {
      let comment = await this.commentModel.findOne({
        $and: [{ _id: comment_id }, { user_id: user_id }],
      });
      if (comment) {
        comment = await this.commentModel.findByIdAndUpdate(
          comment_id,
          updateCommentDto,
          { new: true, session: session },
        );
        this.commentsGateway.onUpdateComment(comment);
        return comment;
      } else {
        throw new ConflictException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteComment(
    user_id: Types.ObjectId,
    comment_id: Types.ObjectId,
    session: ClientSession,
  ) {
    try {
      let comment = await this.commentModel.findOne({
        $and: [{ _id: comment_id }, { user_id: user_id }],
      });

      if (comment) {
        comment = await this.commentModel.findByIdAndDelete(comment_id, {
          session: session,
        });
        this.commentsGateway.onDeleteComment(comment);
        return comment;
      } else {
        throw new ConflictException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

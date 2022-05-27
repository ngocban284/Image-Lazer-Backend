import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Follow } from 'src/follows/entities/follow.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { GetPostDto } from './dto/getPost.dto';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async attachFollower(user_id: Types.ObjectId) {
    // console.log(user_id);
    const parserId = user_id.toString();
    let follow = await this.followModel
      .find({ followed_user_id: parserId })
      .populate('user_id')
      .lean()
      .exec();
    return follow;
  }

  async attachLikesComments(givenPost: any) {
    if (!givenPost) {
      return null;
    }

    let likes = await this.likeModel
      .find({ post_id: givenPost._id + '' })
      .populate('user_id')
      .lean()
      .exec();

    givenPost.likes = likes;

    let comments: any = await this.commentModel
      .find({ post_id: givenPost._id + '' })
      .populate('user_id')
      .lean()
      .exec();

    for (let i = 0; i < comments.length; i++) {
      let replies = await this.commentModel
        .find({ parentComment_id: comments[i]._id + '' })
        .populate('user_id')
        .lean()
        .exec();

      comments[i].replies = replies;
    }

    givenPost.comments = comments;

    return givenPost;
  }

  async createPost(
    user_id: Types.ObjectId,
    photo_url: string,
    photo_height: number,
    photo_width: number,
    postDto: CreatePostDto,
    session: ClientSession,
  ) {
    try {
      let post = new this.postModel({
        ...postDto,
        user_id: user_id,
        photo_url: photo_url,
        photo_height: photo_height,
        photo_width: photo_width,
      });
      await post.save({ session: session });
      return post;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getPost(getPost: GetPostDto) {
    try {
      let pageNumber = getPost.pageNumber || 1;
      let limit = getPost.limit || 25;

      const skip = (pageNumber - 1) * limit;

      let posts: any = await this.postModel
        .find({})
        .populate('user_id')
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
      for (let i = 0; i < posts.length; i++) {
        posts[i] = await this.attachLikesComments(posts[i]);
        posts[i].user_id.followers = await this.attachFollower(
          posts[i].user_id._id,
        );
      }
      return posts;
    } catch {
      throw new NotFoundException();
    }
  }

  async getPostById(post_id: Types.ObjectId) {
    try {
      let post: any = await this.postModel
        .findById(post_id)
        .populate('user_id')
        .lean()
        .exec();

      post = await this.attachLikesComments(post);
      // console.log(post.user_id._id + '', typeof post.user_id._id + '');
      post.user_id.followers = await this.attachFollower(post.user_id._id);

      return post;
    } catch {
      throw new NotFoundException();
    }
  }

  async updatePost(
    user_id: Types.ObjectId,
    post_id: Types.ObjectId,
    updatePostDto: UpdatePostDto,
    session: ClientSession,
  ) {
    try {
      let post = await this.postModel.findOne({
        $and: [{ _id: post_id }, { user_id: user_id }],
      });
      if (!post) {
        throw new UnauthorizedException();
      }
      await this.postModel.findByIdAndUpdate(post_id, updatePostDto, {
        session: session,
      });
      let updatePost: any = await this.postModel.findByIdAndUpdate(
        post_id,
        updatePostDto,
        { new: true, session: session },
      );

      updatePost = await this.attachLikesComments(updatePost);

      return updatePost;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deletePost(
    user_id: Types.ObjectId,
    post_id: Types.ObjectId,
    session: ClientSession,
  ) {
    try {
      let post = await this.postModel.findOne({
        $and: [{ _id: post_id }, { user_id: user_id }],
      });
      if (!post) {
        throw new UnauthorizedException();
      }
      await this.postModel.findByIdAndDelete(post_id, { session: session });
      let postDeleted = await this.postModel.find({}).lean().exec();
      return postDeleted;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getPostByTag(tag: string) {
    try {
      let post = await this.postModel
        .find({ tags: { $regex: tag, $options: '$i' } })
        .lean()
        .exec();
      return post;
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

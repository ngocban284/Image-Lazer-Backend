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
import { Album } from 'src/albums/entities/album.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { UpdatePostOwnerDto } from './dto/updatePostOwner.dto';
import { GetPostDto } from './dto/getPost.dto';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
  ) {}

  async attachFollower(user_id: Types.ObjectId) {
    // console.log(user_id);
    const parserId = user_id.toString();
    let follow = await this.followModel
      .find({ followed_user_id: parserId })
      .populate({
        path: 'user_id',
        select: '-password -refreshToken -__v -refreshTokenExpiry',
      })
      .lean()
      .exec();

    let newFollow = [];
    follow.map((item) => {
      newFollow.push(item.user_id);
    });

    return newFollow;
  }

  async attachFollowing(user_id: Types.ObjectId) {
    const parserId = user_id.toString();
    let folowing = await this.followModel
      .find({ user_id: parserId })
      .populate({
        path: 'followed_user_id',
        select: '-password -refreshToken -__v -refreshTokenExpiry',
      })
      .lean()
      .exec();
    let newFollowing = [];
    folowing.map((item) => {
      newFollowing.push(item.user_id);
    });
    return newFollowing;
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
      .populate('-password')
      .populate('-refreshToken')
      .populate('-__v')
      .populate('-refreshTokenExpiry')
      .lean()
      .exec();

    for (let i = 0; i < comments.length; i++) {
      let replies = await this.commentModel
        .find({ parentComment_id: comments[i]._id + '' })
        .populate('user_id')
        .populate('-password')
        .populate('-refreshToken')
        .populate('-__v')
        .populate('-refreshTokenExpiry')
        .lean()
        .exec();

      comments[i].replies = replies;
    }

    givenPost.comments = comments;

    return givenPost;
  }

  async createPost(
    user_id: Types.ObjectId,
    postDto: CreatePostDto,
    session: ClientSession,
  ) {
    try {
      let album = await this.albumModel.findOne({
        $and: [{ user_id: user_id + '' }, { name: postDto.album }],
      });
      // console.log('album', album);

      let post = new this.postModel({
        user_id: user_id + '',
        album_id: album._id + '',
        image: postDto.image,
        image_height: postDto.image_height,
        image_width: postDto.image_width,
        description: postDto.description,
        link: postDto.link,
        title: postDto.title,
        topic: postDto.topic,
      });

      album = await this.albumModel.findByIdAndUpdate(
        {
          _id: album._id,
        },
        { $push: { post_id: post._id } },
      );

      await post.save({ session: session });
      await album.save({ session: session });

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
        .populate('-password')
        .populate('-refreshToken')
        .populate('-__v')
        .populate('-refreshTokenExpiry')
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
        .populate({
          path: 'user_id',
          select: [
            '_id',
            'userName',
            'fullName',
            'age',
            'email',
            'avatar',
            'following_count',
            'follower_count',
            'topics',
          ],
        })
        .lean()
        .exec();

      post = await this.attachLikesComments(post);
      // console.log(post.user_id._id + '', typeof post.user_id._id + '');
      post.user_id.followers = await this.attachFollower(post.user_id._id);
      post.user_id.following = await this.attachFollowing(post.user_id._id);

      post['userInformation'] = post['user_id'];
      delete post['user_id'];
      delete post['__v'];

      return post;
    } catch {
      throw new NotFoundException();
    }
  }

  async updatePostOwner(
    user_id: Types.ObjectId,
    post_id: Types.ObjectId,
    updatePostDto: UpdatePostOwnerDto,
    session: ClientSession,
  ) {
    try {
      let post = await this.postModel.findById(post_id);
      // console.log(post);
      let album = await this.albumModel.findById(post.album_id);

      console.log(album);
      let newAlbum;
      if (post.user_id == user_id) {
        post = await this.postModel.findByIdAndUpdate(
          post_id,
          {
            $set: {
              album_id: album._id + '',
              title: updatePostDto.title,
              description: updatePostDto.description,
              link: updatePostDto.link,
              topic: updatePostDto.topic,
            },
          },
          { session: session, new: true },
        );
      } else {
        post = await this.postModel.findByIdAndUpdate(
          post_id,
          {
            $set: {
              album_id: album._id + '',
            },
          },
          { session: session, new: true },
        );
      }
      // find new album and push post_id
      newAlbum = await this.albumModel.findOneAndUpdate(
        { $and: [{ user_id: user_id + '' }, { name: updatePostDto.album }] },
        { $push: { post_id: post._id } },
        { session: session, new: true },
      );
      // delete post in old album
      album = await this.albumModel.findByIdAndUpdate(
        { _id: album._id },
        { $pull: { post_id: post_id } },
        { session: session, new: true },
      );
      return post;
    } catch (error) {
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
        $and: [{ _id: post_id }, { user_id: user_id + '' }],
      });
      if (!post) {
        throw new UnauthorizedException();
      }
      let postDeleted = await this.postModel.findByIdAndDelete(post_id, {
        session: session,
      });
      // let postDeleted:any = await this.postModel.find({}).lean().exec();
      //delete post in all album
      let albums = await this.albumModel.find({
        user_id: user_id + '',
        $and: [{ post_id: { $in: [post_id] } }],
      });

      // delete post id in album
      for (let i = 0; i < albums.length; i++) {
        albums[i] = await this.albumModel.findByIdAndUpdate(
          { _id: albums[i]._id },
          { $pull: { post_id: post_id } },
          { session: session, new: true },
        );
      }

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

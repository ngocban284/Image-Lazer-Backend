import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema, ClientSession, Types } from 'mongoose';
import { SavePost } from './entities/savepost.entity';
import { SavePostDto } from './dto/savepost.dto';
import { AddPostToAlbumDto } from './dto/addPostToAlbum.dto';
import { Album } from 'src/albums/entities/album.entity';

export class SavePostRepository {
  constructor(
    @InjectModel(SavePost.name) private readonly savePostModel: Model<SavePost>,
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
  ) {}

  async addPostToAlbum(
    user_id: Types.ObjectId,
    addPostToAlbum: AddPostToAlbumDto,
    session: ClientSession,
  ) {
    try {
      let album = await this.albumModel.findOne({
        $and: [{ user_id: user_id + '' }, { name: addPostToAlbum.album }],
      });
      // console.log('album', album);
      if (!album) {
        throw new Error('Album is not exist');
      } else {
        // add post to album
        let updateAlbum = await this.albumModel
          .findOneAndUpdate(
            {
              _id: album._id + '',
            },
            {
              $push: {
                post_id: addPostToAlbum.post_id,
              },
            },
            {
              session: session,
              new: true,
            },
          )
          .populate('post_id');
        // console.log('updateAlbum', updateAlbum);

        // all album of user

        return updateAlbum;
      }
    } catch (error) {
      throw new ConflictException();
    }
  }

  async createSavePost(
    user_id: Types.ObjectId,
    savePostDto: SavePostDto,
    session: ClientSession,
  ) {
    try {
      let savePost = await this.savePostModel.findOne({
        $and: [{ user_id: user_id }, { post_id: savePostDto.post_id }],
      });

      if (savePost) {
        savePost = await this.savePostModel.findOneAndDelete(
          {
            $and: [{ user_id: user_id }, { post_id: savePostDto.post_id }],
          },
          { session: session },
        );
        return { savePost: false };
      } else {
        savePost = new this.savePostModel(savePostDto);
        savePost = await savePost.save({ session: session });
        return { savePost: true };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSavePost(user_id: Types.ObjectId) {
    try {
      let savePosts: any = await this.savePostModel
        .find({ user_id: user_id })
        .populate({
          path: 'post_id',
          populate: {
            path: 'user_id',
          },
        });

      // savePosts = savePosts.map((savePost) => {
      //   return savePost.post_id;
      // });
      return savePosts;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSavePostById(savepost_id: Types.ObjectId) {
    try {
      let savePost = await this.savePostModel
        .findById({ _id: savepost_id })
        .populate('user_id')
        .populate('post_id');
      console.log(savePost);
      return savePost;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

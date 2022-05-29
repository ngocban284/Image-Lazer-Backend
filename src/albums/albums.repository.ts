import {
  ConflictException,
  forwardRef,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, ClientSession, Model } from 'mongoose';
import { AddPostToAlbumDto } from './dto/addPostToAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { DeletePostOfAlbumDto } from './dto/deletePostOfAlbum.dto';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { Album } from './entities/album.entity';
import { SavePost } from 'src/savePosts/entities/savepost.entity';
import { PostRepository } from 'src/posts/posts.repository';

export class AlbumRepository {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
    @InjectModel(SavePost.name) private readonly savePostModel: Model<SavePost>,
    private readonly postRepository: PostRepository,
  ) {}

  async createAlbum(
    user_id: Types.ObjectId,
    createAlbumDto: CreateAlbumDto,
    session: ClientSession,
  ) {
    try {
      let album = new this.albumModel({
        user_id: user_id,
        name: createAlbumDto.name,
        description: createAlbumDto.description,
        secret: createAlbumDto.secret,
      });
      await album.save({ session: session });
      return album;
    } catch (error) {
      throw new ConflictException();
    }
  }

  async addPostToAlbum(
    user_id: Types.ObjectId,
    albumDto: AddPostToAlbumDto,
    photo_url: string,
    photo_height: number,
    photo_width: number,
    session: ClientSession,
  ) {
    try {
      let album = await this.albumModel.findById({ _id: albumDto.album_id });

      if (albumDto.post_id) {
        let updateAlbum = await this.albumModel.findByIdAndUpdate(
          { _id: album._id },
          { $push: { post_id: albumDto.post_id } },
        );
        updateAlbum = await this.albumModel
          .findById({ _id: updateAlbum._id })
          .populate('post_id');

        let savepost = await this.savePostModel.findOne({
          $and: [
            { user_id: user_id },
            { post_id: albumDto.post_id },
            { album_id: album._id },
          ],
        });
        if (savepost) {
          return updateAlbum;
        } else {
          savepost = new this.savePostModel({
            user_id: user_id,
            post_id: albumDto.post_id,
            album_id: album._id,
          });
          await savepost.save({ session: session });
          return { updateAlbum };
        }
      } else {
        // create new post
        let postDto = {
          description: albumDto.description_post,
          website: albumDto.website_post,
          tags: albumDto.tags_post,
        };
        let post = await this.postRepository.createPost(
          user_id,
          photo_url,
          photo_height,
          photo_width,
          postDto,
          session,
        );

        let updateAlbum = await this.albumModel.findByIdAndUpdate(
          { _id: album._id },
          { $push: { post_id: post._id } },
        );
        updateAlbum = await this.albumModel
          .findById({ _id: updateAlbum._id })
          .populate('post_id');

        let savepost = await this.savePostModel.findOne({
          $and: [
            { user_id: user_id },
            { post_id: post._id },
            { album_id: album._id },
          ],
        });
        if (savepost) {
          return updateAlbum;
        } else {
          savepost = new this.savePostModel({
            user_id: user_id,
            post_id: post._id,
            album_id: album._id,
          });
          await savepost.save({ session: session });
          return { updateAlbum };
        }
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAlbum() {
    try {
      let albums = await this.albumModel.find();
      return albums;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getAlbumByUser(user_id: Types.ObjectId) {
    try {
      let albums = await this.albumModel
        .find({ user_id })
        .populate('post_id')
        .populate('user_id');
      return albums;
    } catch {
      throw new NotFoundException();
    }
  }

  async updateAlbum(
    user_id: Types.ObjectId,
    album_id: Types.ObjectId,
    updateAlbumDto: UpdateAlbumDto,
    session: ClientSession,
  ) {
    try {
      let album = await this.albumModel.findOne({
        $and: [{ user_id: user_id }, { _id: album_id }],
      });
      if (album) {
        album = await this.albumModel.findByIdAndUpdate(
          album_id,
          updateAlbumDto,
          { new: true, session: session },
        );
        return album;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteAlbum(
    user_id: Types.ObjectId,
    album_id: Types.ObjectId,
    deletePost: DeletePostOfAlbumDto,
    session: ClientSession,
  ) {
    try {
      let album = await this.albumModel.findOne({
        $and: [{ user_id: user_id }, { _id: album_id }],
      });

      if (album) {
        album = await this.albumModel.findByIdAndUpdate(
          {
            _id: album_id,
          },
          { $pull: { post_id: deletePost.post_id } },
          { new: true, session: session },
        );
        let newAlbum = await this.albumModel.findById({ _id: album._id });
        await this.savePostModel.findOneAndDelete({ album_id: album_id });
        return newAlbum;
      } else {
        throw new NotFoundException();
      }
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

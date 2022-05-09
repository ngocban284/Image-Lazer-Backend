import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, ClientSession, Model } from 'mongoose';
import { Album } from './entities/album.entity';
import { SavePost } from 'src/savePosts/entities/savepost.entity';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';

export class AlbumRepository {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
    @InjectModel(SavePost.name) private readonly savePostModel: Model<SavePost>,
  ) {}

  async createAlbum(albumDto: CreateAlbumDto, session: ClientSession) {
    try {
      let album = new this.albumModel(albumDto);
      await album.save({ session: session });
      let savepost: any = await this.savePostModel.findOne({
        $and: [{ user_id: albumDto.user_id }, { post_id: albumDto.post_id }],
      });
      if (savepost) {
        return album;
      } else {
        savepost = new this.savePostModel({
          user_id: albumDto.user_id,
          post_id: albumDto.post_id,
        });
        return { album };
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
    album_id: Types.ObjectId,
    updateAlbumDto: UpdateAlbumDto,
    session: ClientSession,
  ) {
    try {
      let album = await this.albumModel.findByIdAndUpdate(
        album_id,
        updateAlbumDto,
        { new: true, session: session },
      );
      return album;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteAlbum(album_id: Types.ObjectId, session: ClientSession) {
    try {
      let album = await this.albumModel.findByIdAndDelete(album_id, {
        session,
      });
      const user_id = album.user_id;
      const post_id = album.post_id;
      let savePost = await this.savePostModel.findOneAndDelete({
        $and: [{ user_id: user_id, post_id: post_id }],
      });
      return album;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

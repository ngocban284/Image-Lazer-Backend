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
      let album = await this.albumModel.findOne({
        $and: [{ user_id: albumDto.user_id }, { name: albumDto.name }],
      });

      if (album) {
        let updateAlbum = await this.albumModel.findByIdAndUpdate(
          { _id: album._id },
          { $push: { post_id: albumDto.post_id } },
        );
        updateAlbum = await this.albumModel
          .findById({ _id: updateAlbum._id })
          .populate('post_id');

        let savepost = await this.savePostModel.findOne({
          $and: [{ user_id: albumDto.user_id }, { post_id: albumDto.post_id }],
        });
        if (savepost) {
          return updateAlbum;
        } else {
          savepost = new this.savePostModel({
            user_id: albumDto.user_id,
            post_id: albumDto.post_id,
          });
          await savepost.save({ session: session });
          return { updateAlbum };
        }
      } else {
        let newAlbum = await this.albumModel.create({
          user_id: albumDto.user_id,
          name: albumDto.name,
          description: albumDto.description,
        });
        let updateAlbum = await this.albumModel.findByIdAndUpdate(
          { _id: newAlbum._id },
          { $push: { post_id: albumDto.post_id } },
        );
        await updateAlbum.save({ session });

        newAlbum = await this.albumModel
          .findById({ _id: updateAlbum._id })
          .populate('post_id');

        let savepost = await this.savePostModel.findOne({
          $and: [{ user_id: albumDto.user_id }, { post_id: albumDto.post_id }],
        });
        if (savepost) {
          return newAlbum;
        } else {
          savepost = new this.savePostModel({
            user_id: albumDto.user_id,
            post_id: albumDto.post_id,
          });
          await savepost.save({ session: session });
          return { newAlbum };
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

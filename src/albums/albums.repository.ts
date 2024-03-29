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
import { Post } from 'src/posts/entities/post.entity';
import { SavePost } from 'src/savePosts/entities/savepost.entity';
import { PostRepository } from 'src/posts/posts.repository';

export class AlbumRepository {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
    @InjectModel(SavePost.name) private readonly savePostModel: Model<SavePost>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly postRepository: PostRepository,
  ) {}

  async createAlbum(
    user_id: Types.ObjectId,
    createAlbumDto: CreateAlbumDto,
    session: ClientSession,
  ) {
    try {
      // check album is already exist
      let album = await this.albumModel.findOne({
        $and: [{ user_id: user_id + '' }, { name: createAlbumDto.name }],
      });
      // console.log('album', album);
      if (album) {
        throw new Error('Album is already exist');
      } else {
        album = new this.albumModel({
          user_id: user_id + '',
          name: createAlbumDto.name,
          description: createAlbumDto.description,
          secret: createAlbumDto.secret,
        });
        await album.save({ session: session });
        return album;
      }
    } catch (error) {
      throw new ConflictException();
    }
  }

  async addPostToAlbum(
    user_id: Types.ObjectId,
    albumDto: AddPostToAlbumDto,
    session: ClientSession,
  ) {
    try {
      // console.log('albumDto', albumDto);
      let album = await this.albumModel.findById({
        _id: albumDto.album_id + '',
      });

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
          album: album.name,
          image: albumDto.image,
          image_height: albumDto.image_height,
          image_width: albumDto.image_width,
          description: albumDto.description,
          title: albumDto.title,
          link: albumDto.link,
          topic: albumDto.topic,
        };
        let post = await this.postRepository.createPost(
          user_id,
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

  async getAlbumById(album_id: Types.ObjectId) {
    try {
      let album: any = await this.albumModel
        .findById({ _id: album_id + '' })
        .populate({
          path: 'post_id',
          select: '_id  image image_height image_width ',
        })
        .populate({
          path: 'user_id',
          select: 'userName fullName',
        });

      let newAlbum = {
        name: album.name,
        description: album.description,
        secret: album.secret,
        userName: album.user_id.userName,
        fullName: album.user_id.fullName,
        images: album.post_id.map((post) => {
          return {
            id: post._id,
            name: post.image,
            src: `/uploads/${post.image}`,
            height: post.image_height,
            width: post.image_width,
          };
        }),
      };

      return newAlbum;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getAlbumByUser(user_id: Types.ObjectId) {
    try {
      let albums = [];
      let albumOfUser: any = await this.albumModel
        .find({ user_id: user_id + '' })
        .populate('post_id');
      // console.log('albumOfUser', albumOfUser);
      albumOfUser.map((album) => {
        let image;
        if (album.post_id.length > 0) {
          image = {
            name: album.post_id[album.post_id.length - 1].image,
            src: `/uploads/${album.post_id[album.post_id.length - 1].image}`,
            height: album.post_id[album.post_id.length - 1].image_height,
            width: album.post_id[album.post_id.length - 1].image_width,
          };
        } else {
          image = {
            name: 'default_avatar_album.png',
            src: '/uploads/default_avatar_album.png',
            height: 400,
            width: 400,
          };
        }
        albums.push({
          id: album._id,
          name: album.name,
          description: album.description,
          secret: album.secret,
          image: image,
        });
      });

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
      let album = await this.albumModel.findById({ _id: album_id + '' });

      if (album.user_id.toString() == user_id.toString()) {
        console.log(updateAlbumDto);
        album = await this.albumModel.findByIdAndUpdate(
          { _id: album._id + '' },
          {
            $set: {
              name: updateAlbumDto.name,
              description: updateAlbumDto.description,
              secret: updateAlbumDto.secret,
            },
          },
          { session: session, new: true },
        );

        return album;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deletePostOfAlbum(
    user_id: Types.ObjectId,
    deletePost: DeletePostOfAlbumDto,
    session: ClientSession,
  ) {
    try {
      let album = await this.albumModel.findOne({
        $and: [{ user_id: user_id + '' }, { name: deletePost.album }],
      });

      if (album) {
        album = await this.albumModel.findByIdAndUpdate(
          {
            _id: album._id + '',
          },
          { $pull: { post_id: deletePost.post_id } },
          { new: true, session: session },
        );
        // let newAlbum = await this.albumModel.findById({ _id: album._id + '' });

        return album;
      } else {
        throw new NotFoundException();
      }
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteAlbum(
    user_id: Types.ObjectId,
    album_id: Types.ObjectId,
    session: ClientSession,
  ) {
    try {
      let album = await this.albumModel
        .findById({ _id: album_id + '' })
        .populate('post_id');

      let notRemovePostId = [];
      let removePostId = [];
      album.post_id.map((post: any) => {
        if (post.user_id != user_id + '') {
          notRemovePostId.push(post._id);
        } else {
          removePostId.push(post._id);
        }
      });

      // remove post of album
      await this.albumModel.findByIdAndUpdate(
        { _id: album._id + '' },
        { $pull: { post_id: notRemovePostId } },
      );

      // remove post of user
      for (let i = 0; i < removePostId.length; i++) {
        await this.postModel.findByIdAndDelete({ _id: removePostId[i] + '' });
      }

      // remove album
      await this.albumModel.findByIdAndDelete({ _id: album._id + '' });

      // console.log('removePostId', removePostId);
      // await this.albumModel.findByIdAndDelete(album._id);

      return album;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

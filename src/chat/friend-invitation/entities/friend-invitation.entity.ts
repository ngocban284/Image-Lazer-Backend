import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type FriendInvitationDocument = FriendInvitation & Document;

@Schema()
export class FriendInvitation extends Document {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  senderId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  receiveId: User;
}

export const FriendInvitationSchema =
  SchemaFactory.createForClass(FriendInvitation);

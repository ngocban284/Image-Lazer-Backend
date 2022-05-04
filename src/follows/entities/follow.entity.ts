import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';
import { User } from '../../users/entities/user.entity';

// Schema({ timestamps: true });
// export class Follow extends Document {
//   @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
//   user_id: Types.ObjectId;

//   @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
//   followed_user_id: Types.ObjectId;
// }

@Schema({ timestamps: true })
export class Follow extends Document {
  @Prop()
  user_id: string;

  @Prop()
  followed_user_id: string;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

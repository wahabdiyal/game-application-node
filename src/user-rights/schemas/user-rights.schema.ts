import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export enum UserType {
//     admin = "admin",
//     operator = "operator",
//     player = "player"
// }
@Schema({
  timestamps: true,
})
export class UserRights extends Document {
  @Prop({ required: true })
  link: string;
  @Prop({ required: true })
  controller: string;
  @Prop({ required: true })
  role: string;
  @Prop()
  access: number;

  @Prop()
  created_by: string;
  @Prop()
  updated_by: string;
}
export const UserRightSchema = SchemaFactory.createForClass(UserRights);

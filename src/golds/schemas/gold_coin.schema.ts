import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
export enum Type {
  credit = 'credit',
  debit = 'debit',
}
export enum Status {
  approved = 'approved',
  pending = 'pending',
}
@Schema({
  timestamps: true,
})
export class Gold extends Document {
  @Prop({ default: 'pending' })
  status: Status;
  @Prop()
  coins: string;
  @Prop({ default: null })
  type: string;
  @Prop()
  bal: string;
  @Prop()
  remarks: string;
  @Prop()
  client_id: string;
  @Prop()
  game_id: string;
  @Prop()
  created_by: string;
  @Prop()
  updated_by: string;
  @Prop()
  userId: string;

  @Prop({ default: 'xxxx' })
  transaction_id: string;

  @Prop({ default: 'yyy' })
  transaction_status: string;
  @Prop({ default: '0' })
  amount: string;
}
export const GoldSchema = SchemaFactory.createForClass(Gold);

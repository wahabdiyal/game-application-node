import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
export enum Status {
  pending = 'pending',
  inprocess = 'inprocess',
  approved = 'approved',
  cancled = 'cancled',
}
@Schema({
  timestamps: true,
})
export class PurchaseRequests extends Document {
  @Prop({ default: '0' })
  amount: string;
  @Prop({ default: '0' })
  transaction_id: string;
  @Prop()
  remarks: string;
  @Prop()
  file_url: string;
  @Prop({ default: 0 })
  gold_coin: string;
  @Prop({ default: 0 })
  silver_coin: string;
  @Prop({ default: '0' })
  silver_coin_amount: string;
  @Prop({ default: 'pending' })
  status: Status;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: User;
  @Prop()
  country: string;
  @Prop()
  first_name: string;
  @Prop()
  last_name: string;
  @Prop()
  userId: string;
  @Prop()
  purchase_id: string;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  operator: [string];
}
export const PurchaseRequestsSchema =
  SchemaFactory.createForClass(PurchaseRequests);

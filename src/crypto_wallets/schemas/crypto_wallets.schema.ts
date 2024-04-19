import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({
  timestamps: true,
})
export class CryptoWallet extends Document {
  @Prop({ required: true })
  wallet_detail: [string];
  @Prop({ required: true })
  country: [string];

  @Prop()
  created_by: string;
  @Prop()
  updated_by: string;
  @Prop()
  coins_name: string;
}
export const CryptoWalletSchema = SchemaFactory.createForClass(CryptoWallet);

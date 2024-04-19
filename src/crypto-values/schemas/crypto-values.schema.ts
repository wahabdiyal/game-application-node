import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class CryptoValues extends Document {
  @Prop({ required: true })
  price_usd: '';

  @Prop({ default: '' })
  wallet_no: '';
  @Prop({ default: '' })
  wallet_name: '';
  @Prop({ default: '' })
  coins_code: '';
  @Prop({ default: '' })
  coins_name: '';

  @Prop({ default: '' })
  country: '';
}
export const CryptoValuesScheme = SchemaFactory.createForClass(CryptoValues);

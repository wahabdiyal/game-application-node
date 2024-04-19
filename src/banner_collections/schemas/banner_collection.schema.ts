import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class BannerCollection extends Document {
  @Prop({ default: 'active', required: true })
  status: string;
  @Prop({ default: '', required: true })
  collection_name: string;
  @Prop({ required: true })
  country: [string];
  @Prop({ required: true })
  country_mobile: [string];
  @Prop({ required: true })
  banner_id: [string];

  @Prop()
  created_by: string;
  @Prop()
  updated_by: string;
}
export const BannerCollectionSchema =
  SchemaFactory.createForClass(BannerCollection);

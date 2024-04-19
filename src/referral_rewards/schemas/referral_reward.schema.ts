import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ReferralReward extends Document {
  @Prop()
  name: string;
  @Prop({ required: true, default: 0 })
  silver_coin: string;
  @Prop({ required: true, default: 0 })
  gold_coin: string;
  @Prop({ required: true, default: 0 })
  referral_limit: string;
  @Prop({ required: true, default: 0 })
  days_limit: string;

  @Prop({ default: null })
  start_date: Date;
  @Prop({ default: null })
  end_date: Date;

  @Prop({ default: null })
  description: string;

  @Prop()
  created_by: string;
  @Prop()
  updated_by: string;
}

export const ReferralRewardSchema =
  SchemaFactory.createForClass(ReferralReward);

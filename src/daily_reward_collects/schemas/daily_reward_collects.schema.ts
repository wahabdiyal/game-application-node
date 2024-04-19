import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class DailyRewardCollects extends Document {
  @Prop({ default: 'active', required: true })
  status: string;
  @Prop({ required: true, default: 0 })
  reward_count: string;
  @Prop({ default: 0 })
  total_reward: string;
  @Prop({ required: true })
  user_id: string;
  @Prop({ required: true, default: null })
  date: string;
  @Prop({ required: true })
  country: string;

  @Prop()
  created_by: string;
  @Prop()
  updated_by: string;
}
export const DailyRewardCollectsSchema =
  SchemaFactory.createForClass(DailyRewardCollects);

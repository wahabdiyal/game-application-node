import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({
    timestamps: true,
})
export class SignupReward extends Document {
    @Prop()
    name: string;
    @Prop({ default: "active" })
    status: string;
    @Prop({ required: true })
    silver_coin: string;
    @Prop({ required: true })
    gold_coin: string;
    @Prop({ required: true, })
    start_time: string;
    @Prop({ required: true, })
    end_time: string;
    @Prop()
    description: string;
    @Prop({ default: "all_countries", required: true })
    country: [any];


}
export const SignupRewardSchema = SchemaFactory.createForClass(SignupReward)



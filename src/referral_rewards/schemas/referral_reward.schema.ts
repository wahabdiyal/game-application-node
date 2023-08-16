 import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
 
@Schema({
        timestamps: true,
})
export class ReferralReward  extends Document{
    @Prop({required:true, default: Date.now().toString(36)+(Math.random() + 2).toString(36).substring(8),unique:true})
    referral_code:string;
    @Prop()
    name:string;
    @Prop({required: true,default:0})
    silver_coin:string;
    @Prop({required: true,default:0})
    gold_coin:string;
    @Prop({required: true,default:0})
    referral_limit:string;
    @Prop({required: true,default:0})
    days_limit:string;

    @Prop({default: null,})
    start_date:string;
    @Prop({default: null,})
    end_date:string;
    
    @Prop({default: null,})
    description:string;
 
    
}


export const ReferralRewardSchema = SchemaFactory.createForClass(ReferralReward)



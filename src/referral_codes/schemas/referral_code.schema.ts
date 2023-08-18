import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
 
@Schema({
        timestamps: true,
})
export class ReferralCode  extends Document{
    @Prop({required:true, default: Date.now().toString(36)+(Math.random() + 2).toString(36).substring(8),unique:true})
    referral_code:string;
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true,default:0})
    user_id:string;
    @Prop({required: true,default:0})
    total_use:string;
    @Prop({required: true,default:0})
    use_date:string;

 
}
export const ReferralCodeSchema = SchemaFactory.createForClass(ReferralCode)



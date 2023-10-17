import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

 
 
@Schema({
        timestamps: true,
})
export class DailyReward  extends Document{
   
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true,default:"0"})
    title:string;
    @Prop({required: true,default:0})
    start_date:Date;
    @Prop({required: true,default:0})
    end_date:Date;
    @Prop({required: true,default:0})
    inactive_day:string;
    @Prop({required: true,default:0})
    description:string;
    @Prop({required: true })
    country:[string];
    @Prop({required: true,default:0})
    silver_coin:string;
    @Prop({required: true,default:0})
    gold_coin:string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
 
}
export const DailyRewardSchema = SchemaFactory.createForClass(DailyReward)



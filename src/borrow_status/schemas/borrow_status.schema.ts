import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class BorrowStatus  extends Document{
   
    @Prop({required: true,default:false})
    gold_status:string;
    @Prop()
    remarks:string;
  
}
export const BorrowStatusSchema = SchemaFactory.createForClass(BorrowStatus)
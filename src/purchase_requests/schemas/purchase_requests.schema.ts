import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export enum Status {
    pending = "pending",
    inprocess = "inprocess",
    approved = "approved",
    cancled = "cancled"
}
@Schema({
    timestamps: true,
})
export class PurchaseRequests  extends Document{
   
    @Prop({required: true,default:'0'})
    amount:string;
    @Prop({required: true,default:'0'})
    transaction_id:string;
    @Prop()
    remarks:string;
    @Prop()
    file_url:string;
    @Prop({required: true})
    user_id:string;
    @Prop({default:0})
    gold_coin:string;
    @Prop({default:0})
    silver_coin:string;
    @Prop({default:"pending"})
    status:Status;
}
export const PurchaseRequestsSchema = SchemaFactory.createForClass(PurchaseRequests)
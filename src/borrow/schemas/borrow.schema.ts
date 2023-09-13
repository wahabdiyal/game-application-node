import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class Borrow  extends Document{
    @Prop({required:true})
    sender:string;
    @Prop({required: true})
    receiver:string;
    @Prop({default:0})
    gold_coin:string;
    @Prop({default:0})
    silver_coin:string;
    @Prop({default:0})
    type:string;
    @Prop({required: true,default:'pending'})
    status:string;
    @Prop()
    remarks:string;
    @Prop({required: true,default:false})
    is_reverse:boolean;
}
export const BorrowSchema = SchemaFactory.createForClass(Borrow)
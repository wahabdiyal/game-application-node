import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
@Schema({
    timestamps: true,
})
export class Borrow extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    sender: string;
    @Prop({ default: 0 })
    sender_country: string;
    @Prop({ type: Types.ObjectId, ref: 'User' })
    receiver: string;
    @Prop({ default: 0 })
    receiver_country: string;
    @Prop({ default: 0 })
    gold_coin: string;
    @Prop({ default: 0 })
    silver_coin: string;
    @Prop({ default: 0 })
    type: string;
    @Prop({ required: true, default: 'pending' })
    status: string;
    @Prop()
    remarks: string;
    @Prop({ required: true, default: false })
    is_reverse: boolean;
    @Prop({ default: 0 })
    transaction_id: string;
    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
}
export const BorrowSchema = SchemaFactory.createForClass(Borrow)
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Decimal128, Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";

export enum Status {
    approved = "approved",
    pending = "pending",

}
@Schema({
    timestamps: true,
})
export class Withdraw_limits extends Document {


    @Prop({ default: 0 })
    min_silver_coin: Number;
    @Prop({ default: 0 })
    min_gold_coin: Number;
    @Prop({ default: "pending" })
    status: Status;
    @Prop({ default: 0 })
    percentage: Number;
    @Prop({ default: 0 })
    countries: String[];
    @Prop({ default: 0 })
    description: String;
}
export const Withdraw_limitsSchema = SchemaFactory.createForClass(Withdraw_limits)



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
    min_gold_coin: String;
    @Prop({ default: 0 })
    max_gold_coin: String;
    @Prop({ default: "pending" })
    status: String;
    @Prop({ default: 0 })
    percentage: String;
    @Prop({ default: 0 })
    countries: String[];
    @Prop({ default: 0 })
    description: String;
}
export const Withdraw_limitsSchema = SchemaFactory.createForClass(Withdraw_limits)



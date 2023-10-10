import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";

export enum Type {
    credit = "credit",
    debit = "debit",

}
export enum Status {
    approved = "approved",
    pending = "pending",

}
@Schema({
    timestamps: true,
})
export class Silver extends Document {
    @Prop({ default: "pending" })
    status: Status;
    @Prop()
    coins: string;
    @Prop({ default: null })
    type: Type;
    @Prop()
    bal: string;
    @Prop()
    remarks: string;
    @Prop({ default: null, })
    entry_by: string;
    @Prop()
    @Prop()
    client_id: string;
    @Prop()
    userId: string;

}
export const SilverSchema = SchemaFactory.createForClass(Silver)



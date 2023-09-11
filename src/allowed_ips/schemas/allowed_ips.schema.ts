
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";
@Schema({
    timestamps: true,
})
export class AllowedIP extends Document {
    @Prop({ default: "active", required: true })
    status: string;
    @Prop({ required: true })
    remarks: string;
    @Prop({ required: true })
    ip_address: string;

    // @Prop({ required: true })
    // operator: string;

    @Prop({ type: Types.ObjectId, ref: 'User' }) // Reference the Operator schema
    operator: User;

}
export const AllowedIPSchema = SchemaFactory.createForClass(AllowedIP)




import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
    timestamps: true,
})
export class Allowed_IPs extends Document {
    @Prop({ default: "active", required: true })
    status: string;
    @Prop({ required: true })
    remarks: string;
    @Prop({ required: true })
    ip_address: string;

}
export const Allowed_IPsSchema = SchemaFactory.createForClass(Allowed_IPs)



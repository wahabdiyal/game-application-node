
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
    timestamps: true,
})
export class RechargeAdminWallets extends Document {
    @Prop({ default: "" })
    coins: string;

    @Prop({ default: "" })
    transaction_type: string;

    @Prop({ default: "" })
    remarks: string;

}
export const RechargeAdminWalletsSchema = SchemaFactory.createForClass(RechargeAdminWallets)



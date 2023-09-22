
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
    timestamps: true,
})
export class UserCryptoWallet extends Document {


    // @Prop({ required: true })
    // status: string;
    @Prop({ required: true })
    wallet_no: string;
    @Prop({ required: true })
    wallet_name: string;
    @Prop({ required: true })
    user_id: string;
    @Prop({ default: 0 })
    is_selected: number;
    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;

}
export const UserCryptoWalletSchema = SchemaFactory.createForClass(UserCryptoWallet)



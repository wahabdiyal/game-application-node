
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class CryptoWallet  extends Document{
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true})
    wallet_detail:[string];
    @Prop({required: true})
    country:string;
    
}
export const CryptoWalletSchema = SchemaFactory.createForClass(CryptoWallet)



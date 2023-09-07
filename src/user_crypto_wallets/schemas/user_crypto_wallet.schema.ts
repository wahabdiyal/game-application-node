
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class UserCryptoWallet  extends Document{
     
    @Prop({required: true})
    wallet_detail:[string];
    @Prop({required: true})
    user_id:string;
    
}
export const UserCryptoWalletSchema = SchemaFactory.createForClass(UserCryptoWallet)



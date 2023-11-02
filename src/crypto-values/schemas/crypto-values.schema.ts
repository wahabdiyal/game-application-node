import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class CryptoValues extends Document {
    @Prop({ required: true })
    price_usd: "";

    @Prop({ default: "" })
    wallet_no: "";
    @Prop({ default: "" })
    wallet_name: "";
    @Prop({ default: "" })
    coinsCode: "";
    @Prop({ default: "" })
    coinName: "";

    @Prop({ default: "" })
    country: "";

}
export const CryptoValuesScheme = SchemaFactory.createForClass(CryptoValues)



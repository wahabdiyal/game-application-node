import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class CryptoValues extends Document {
    @Prop({ required: true })
    list: [];

}
export const CryptoValuesScheme = SchemaFactory.createForClass(CryptoValues)



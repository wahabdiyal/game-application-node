
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class Currency  extends Document{
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true})
    data:[string];
    @Prop({required: true})
    meta:[string];
    
}
export const CurrencySchema = SchemaFactory.createForClass(Currency)



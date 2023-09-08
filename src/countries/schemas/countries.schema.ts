import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
@Schema({
        timestamps: true,
})
export class Country extends Document{
    @Prop({required: true,unique: true})
    code:string;
    @Prop({required: true,unique: true})
    currency:string;
    @Prop({required: true,unique: true})
    country:string;
    @Prop({default:"true"})
    status:string;
  
}
export const CountrySchema = SchemaFactory.createForClass(Country)



import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
@Schema({
        timestamps: true,
})
export class Country extends Document{
    @Prop({required: true})
    code:string;
    @Prop()
    currency:string;
    @Prop({required: true})
    country:string;
    @Prop({default:"true"})
    status:string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
  
}
export const CountrySchema = SchemaFactory.createForClass(Country)



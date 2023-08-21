import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
 
@Schema({
        timestamps: true,
})
export class Contact extends Document{
    
    @Prop({required: true,})
    phone:string;
    @Prop()
    country_id:string;
}
export const ContactSchema = SchemaFactory.createForClass(Contact)



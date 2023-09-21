import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
 
@Schema({
        timestamps: true,
})
export class Bets  extends Document{
    
    
    @Prop({ required:true})
    first_player:string;
    @Prop({required: true})
    second_player:string;
    @Prop({required: true,})
    description:string;
    @Prop({required: true,default:null})
    file_url:string;

 
}
export const BetsSchema = SchemaFactory.createForClass(Bets)



import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class Challenges  extends Document{
     
    @Prop({required: true,default:""})
    remarks:string;
    @Prop({required: true,default:""})
    title:string;
    @Prop({required: true})
    game_id:string;
    @Prop()
    client_id:string;
    
}
export const ChallengesSchema = SchemaFactory.createForClass(Challenges)



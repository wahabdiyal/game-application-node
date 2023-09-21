import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
 
@Schema({
        timestamps: true,
})
export class Bets  extends Document{
    @Prop({required:true})
    first_player:string;
    @Prop({ required:true})
    game_id:string;
    @Prop({required: true,default:"ai"})
    second_player:string;
    @Prop({default:"0"})
    gold:string;
    @Prop({default:"0"})
    silver:string;
    @Prop({default:"active"})
    status:string;
    @Prop({required: true,})
    remark:string;
}
export const BetsSchema = SchemaFactory.createForClass(Bets)



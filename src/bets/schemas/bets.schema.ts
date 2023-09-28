import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
 
@Schema({
        timestamps: true,
})
export class Bets  extends Document{
    @Prop({required:true})

    first_player:string;
    @Prop({ required:true})

    second_player:string;
    @Prop({default:"0"})

    game_id:string;
    @Prop({default:""})
       
    gold:string;
    @Prop()
    winner:string;
    @Prop({default:"0"})
    silver:string;
    @Prop({default:"inactive"})
    status:string;
    @Prop({required: true,})
    remark:string;

    @Prop({default:"0"})
    counter:string;
}
export const BetsSchema = SchemaFactory.createForClass(Bets)



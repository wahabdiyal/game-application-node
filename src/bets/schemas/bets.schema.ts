import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Games } from "src/games/schemas/games.schema";
import { User } from "src/user/schemas/user.schema";
 
@Schema({
        timestamps: true,
})
export class Bets  extends Document{
    @Prop({required:true, type: Types.ObjectId, ref: 'User'})

    first_player:string;
    @Prop()
    first_email:string;
    @Prop()
    first_name:string;
    @Prop()
    first_user_id:string;
    @Prop({default:new Date().getTime()+Math.random().toString(36).slice(-8)})
    transaction_id: string;
    @Prop({default:0})
    ignore_count:string;
    @Prop({ type: Types.ObjectId, ref: 'User'})
    second_player:string;
    @Prop()
    second_email:string;
    @Prop()
    second_name:string;
    @Prop()
    second_user_id:string;
    @Prop()
    second_join_time:string;
    @Prop({default:"0", type: Types.ObjectId, ref: 'Games'})

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



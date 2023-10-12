
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Games } from "src/games/schemas/games.schema";
import { User } from "src/user/schemas/user.schema";
@Schema({
        timestamps: true,
})
export class AdminAccount  extends Document{
     
    @Prop({required: true,default:""})
    remarks:string;
    @Prop({required: true,default:"0"})
    debit:string;
    @Prop({required: true,default:"0"})
    credit:string;
    @Prop({default:new Date().getTime()+Math.random().toString(36).slice(-8)})
    transaction_id: string;
    
    @Prop({required: true,default:"0"})
    gold_coin_balance:string;
  
    @Prop({type: Types.ObjectId, ref: 'User' })
    first_player:User;
    
    @Prop({ type: Types.ObjectId, ref: 'User' })
    second_player:User;

    @Prop({type: Types.ObjectId, ref: 'Games' })
    game_id:Games;

    @Prop({default:"other"})
    type:string;
   
    @Prop()
    country:string;

    @Prop()
    bet_id:string;

    @Prop()
    withdraw_id:string;

    @Prop()
    created_by: string;

    @Prop()
    updated_by: string;

    @Prop({ type: Types.ObjectId, ref: 'User'})
    user_id:string;

    @Prop()
    email:string;

 
}
export const AdminAccountSchema = SchemaFactory.createForClass(AdminAccount)



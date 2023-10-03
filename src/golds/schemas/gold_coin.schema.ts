import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";
export enum Type{
    credit="credit",
    debit="debit",
  
}
export enum Status{
    approved="approved",
    pending="pending",
  
}
@Schema({
        timestamps: true,
})
export class Gold extends Document{
    @Prop({default:"pending"})
    status:Status;
    @Prop()
    coins:string;
    @Prop({default:null })
    type:Type ;
    @Prop()
    bal:string;
    @Prop()
    remarks:string;
    @Prop({ type: Types.ObjectId, ref: 'User'})
    client_id: User;
    @Prop({ type: Types.ObjectId, ref: 'Game'})
    game_id:string;
    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
    @Prop()
    userId:string;

    
}
export const GoldSchema = SchemaFactory.createForClass(Gold)



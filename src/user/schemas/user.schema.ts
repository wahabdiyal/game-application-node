import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
export enum UserType{
    admin="admin",
    manager="operator",
    user="player"
}
@Schema({
        timestamps: true,
})
export class User extends Document{
    
    @Prop()
    full_name:string;
    @Prop({required: true})
    country:string;
    @Prop({default: 'active'})
    status:string;

    @Prop({default: null,})
    created_by:string;
    
    @Prop({default: null,})
    updated_by:string;

    @Prop({ required: true, unique: true })
    email:string;
    @Prop()
     password: string
     
     @Prop({default: "player"})
    role:UserType;
    @Prop({ required: true, unique: true })
    phone:number;

    @Prop({required: true,default:0})
    silver_balance:string; 
    @Prop({required: true,default:0})
    gold_balance:string; 
}


export const UserSchema = SchemaFactory.createForClass(User)



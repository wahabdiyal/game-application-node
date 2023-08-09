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
    @Prop({required:true, default: Date.now().toString(36)+(Math.random() + 2).toString(36).substring(8),unique:true})
    user_key:string;
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

    // @Prop({ type: Types.ObjectId, ref: 'User',default: null})
    // user_id: User; 

    @Prop({ required: true, unique: true })
    email:string;
    @Prop()
     password: string
     
     @Prop({default: "player"})
    role:UserType;
    @Prop()
    phone:number;

    @Prop({required: true,default:0})
    silver_balance:string; 
    @Prop({required: true,default:0})
    gold_balance:string; 
}


export const UserSchema = SchemaFactory.createForClass(User)



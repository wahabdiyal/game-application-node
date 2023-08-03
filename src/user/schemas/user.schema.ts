import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
export enum UserType{
    admin="admin",
    manager="manager",
    user="user"
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

    // @Prop({ type: Types.ObjectId, ref: 'User',default: null})
    // user_id: User; 

    @Prop({ required: true, unique: true })
    email:string;
    @Prop()
     password: string
     
     @Prop({default: "user"})
    role:UserType;
    @Prop()
    phone:number;
}
export const UserSchema = SchemaFactory.createForClass(User)



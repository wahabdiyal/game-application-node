import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export enum UserType{
    admin="admin",
    manager="manager",
    user="user"
}
@Schema({
        timestamps: true,
})
export class UserRight extends Document{
     
    @Prop({required: true})
    url:string;
    @Prop({required: true})
    role_name:UserType;
    @Prop()
    access:string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
}
export const UserRightSchema = SchemaFactory.createForClass(UserRight)

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export enum UserType {
    admin = "admin",
    operator = "operator",
    player = "player"
}
@Schema({
    timestamps: true,
})
export class UserMenu extends Document {

    @Prop({ required: true })
    menu: string;
    @Prop({ required: true })
    role: UserType;
    @Prop()
    access: number;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
}
export const UserMenuSchema = SchemaFactory.createForClass(UserMenu)

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export enum UserType {
    admin = "admin",
    manager = "operator",
    user = "player"
}
@Schema({
    timestamps: true,
})
export class User extends Document {

    @Prop()
    full_name: string;
    @Prop()
    first_name: string;
    @Prop({ default: null })
    user_ip: string;
    @Prop({ default: 0 })
    block: string;
    @Prop()
    last_name: string;
    @Prop({ required: true })
    country: string;
    @Prop({ default: 'active' })
    status: string;

    @Prop({ default: null, })
    created_by: string;

    @Prop({ default: null, })
    updated_by: string;

    @Prop({ required: true, unique: true })
    email: string;
    @Prop()
    password: string

    @Prop({ default: "player" })
    role: UserType;

    @Prop({ unique: true })
    phone: string;

    @Prop({ required: true, default: 0 })
    silver_balance: string;
    @Prop({ required: true, default: 0 })
    gold_balance: string;
    @Prop({ default: "image.png" })
    file_url: string;
    @Prop()
    user_login_token:string;
}


export const UserSchema = SchemaFactory.createForClass(User)



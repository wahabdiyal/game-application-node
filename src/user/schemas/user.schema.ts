import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export enum UserType{
    Admin="Admin",
    User="User"
}
@Schema({
        timestamps: true,
})
export class User{
    @Prop()
    name:string;
    @Prop()
    email:string;
    @Prop()
    password:string;
    role:UserType;
    @Prop()
    phone:number;
    // @Prop()
    // simple:UserCallType<User>;
}
export const UserSchema = SchemaFactory.createForClass(User)



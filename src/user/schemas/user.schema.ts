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
    @Prop({ required: true, unique: true })
    email:string;
    @Prop()
     password: string
     @Prop({default: "User"})
    role:UserType;

    @Prop()
    phone:number;
 
}
export const UserSchema = SchemaFactory.createForClass(User)



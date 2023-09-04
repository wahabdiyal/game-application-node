
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class UserBank  extends Document{
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true})
    card:[string];
    @Prop({required: true})
    user_id:string;
    @Prop({default: "",})
    remarks:string;
}
export const UserBankSchema = SchemaFactory.createForClass(UserBank)



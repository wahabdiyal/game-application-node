
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
    timestamps: true,
})
export class UserBank extends Document {


    @Prop({ required: true })
    bank_name: string;
    @Prop({ required: true })
    account: string;
    @Prop({ required: true })
    iban: string;
    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    user_id: string;
    // @Prop({ default: "", })
    // remarks: string;
}
export const UserBankSchema = SchemaFactory.createForClass(UserBank)




import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class AdminBank  extends Document{
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true})
    bank_detail:[string];
    @Prop({required: true})
    country:string;
    
}
export const AdminBankSchema = SchemaFactory.createForClass(AdminBank)



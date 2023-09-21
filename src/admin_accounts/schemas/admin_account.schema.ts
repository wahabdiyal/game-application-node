
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class AdminAccount  extends Document{
     
    @Prop({required: true,default:""})
    remarks:string;
    @Prop({required: true,default:"0"})
    debit:string;
    @Prop({required: true,default:"0"})
    credit:string;
    @Prop({required: true,default:"0"})
    gold_coin_balance:string;
    @Prop()
 
    client_id:string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
 
    user_id:string;
    @Prop()
    email:string;
 
}
export const AdminAccountSchema = SchemaFactory.createForClass(AdminAccount)




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
<<<<<<< HEAD
=======
 
>>>>>>> 68581237917fbd68e032873d9d56b71e9950f8a3
    client_id:string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
<<<<<<< HEAD
    
=======
 
    user_id:string;
    @Prop()
    email:string;
 
>>>>>>> 68581237917fbd68e032873d9d56b71e9950f8a3
}
export const AdminAccountSchema = SchemaFactory.createForClass(AdminAccount)



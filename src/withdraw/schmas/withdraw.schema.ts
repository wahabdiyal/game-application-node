import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";
 
export enum Status{
    approved="approved",
    pending="pending",
    inprocessed="inprocessed",
    cancel="cancel"
  
}
@Schema({
        timestamps: true,
})
export class Withdraw extends Document{
    @Prop({default:"pending"})
    status:Status;
    @Prop({default:0})
    coins:Number;
    @Prop({default: null,})
    proved_date :string;
    @Prop({default: null,})
    remarks :string;
    @Prop({default: null,})
    proved_by :string;
    @Prop({ type: Types.ObjectId, ref: 'User'})
    client_id: User; 

    @Prop({default: 0,})
    total_amount :string;
    @Prop({default: 0,})
    admin_commission :string;
    @Prop({default: 0,})
    withdraw_amount :string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
}
export const WithdrawSchema = SchemaFactory.createForClass(Withdraw)



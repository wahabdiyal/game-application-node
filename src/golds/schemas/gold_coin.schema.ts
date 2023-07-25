import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";

@Schema({
        timestamps: true,
})
export class GoldCoin extends Document{
    @Prop()
    staus:string;
    @Prop()
    remarks:string;
    @Prop({default: null,})
    created_by:string;
    @Prop({default: null,})
    updated_by:string;
    @Prop({ type: Types.ObjectId, ref: 'User',default: null})
    user_id: User; 

    
}
export const GoldCoinSchema = SchemaFactory.createForClass(GoldCoin)



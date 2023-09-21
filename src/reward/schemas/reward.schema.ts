import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";

@Schema({
        timestamps: true,
})
export class Reward extends Document{
    @Prop()
    staus:string;
    @Prop()
    remarks:string;
    @Prop({default: 0})
    coins:string;
    @Prop({default: null})
    type:string;
    
    @Prop({ type: Types.ObjectId, ref: 'User'})
    client_id: User; 

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;

    
}
export const RewardSchema = SchemaFactory.createForClass(Reward)



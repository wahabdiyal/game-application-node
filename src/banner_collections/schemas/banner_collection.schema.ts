import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
 
@Schema({
        timestamps: true,
})
export class BannerCollection  extends Document{
    
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true})
    country:[string];
    @Prop({required: true,})
    banner_id:[string];
   

 
}
export const BannerCollectionSchema = SchemaFactory.createForClass(BannerCollection)



import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
 
 
@Schema({
        timestamps: true,
})
export class Banner  extends Document{
    
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true})
    title:string;
    @Prop({required: true,})
    description:string;
    @Prop({required: true,default:null})
    file_url:string;

 
}
export const BannerSchema = SchemaFactory.createForClass(Banner)




import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({
        timestamps: true,
})
export class Package  extends Document{
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true,default:""})
    file_url:string;
    @Prop({required: true,default:""})
    title:string;
    @Prop({required: true,default:""})
    silver_coin:string;
    @Prop({required: true,default:""})
    gold_coin:string;
    @Prop({required: true,default:""})
    amount_pkr:string;
    @Prop({required: true,default:""})
    country:string;
    

}
export const PackageSchema = SchemaFactory.createForClass(Package)



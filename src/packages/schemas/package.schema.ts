
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
    @Prop({required: true,default:0})
    silver_coin:string;
    @Prop({required: true,default:0})
    gold_coin:string;
    @Prop({required: true,default:0})
    amount_usd:string;
    @Prop({required: true,default:""})
    country:string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
    

}
export const PackageSchema = SchemaFactory.createForClass(Package)



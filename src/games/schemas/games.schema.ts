import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
  
@Schema({
        timestamps: true,
})

export class Games extends Document{
    @Prop({unique: true,required: true})
    game_id:string;
    @Prop()
    title:string;
    @Prop({default: "picture.png"})
    file_url:string;
    @Prop({default: 'active'})
    status:string;
    @Prop({default: "null",})
    description:string;
}
export const GamesSchema = SchemaFactory.createForClass(Games)



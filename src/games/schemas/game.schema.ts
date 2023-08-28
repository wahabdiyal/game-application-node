import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
  
@Schema({
        timestamps: true,
})
export class Game extends Document{
    @Prop()
    title:string;
    @Prop({default: "picture.png"})
    picture:string;
    @Prop({default: 'active'})
    status:string;
    @Prop({default: "null",})
    description:string;
}
export const GameSchema = SchemaFactory.createForClass(Game)



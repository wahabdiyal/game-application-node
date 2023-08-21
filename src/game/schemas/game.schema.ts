import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
export enum Status{
    active="active",
    closed="closed",
}
@Schema({
        timestamps: true,
})
export class Game extends Document{
    @Prop({default:"active"})
    status:Status;
    @Prop()
    name:string;
}
export const GameSchema = SchemaFactory.createForClass(Game)

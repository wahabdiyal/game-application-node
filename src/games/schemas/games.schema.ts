import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})

export class Games extends Document {
    @Prop({ unique: true, required: true })
    game_id: string;

    @Prop()
    title: string;

    @Prop({ default: "picture.png" })
    file_url: string;

    @Prop({ default: 'active' })
    status: string;

    @Prop({ default: '0' })
    challenge_time_minutes: string; //in minutes

    @Prop({ default: '0' })
    maximum_challenges: string;

    @Prop({ default: '0' })
    commission: string;

    @Prop({ default: '0' })
    time_restrictions: string;; //in minutes

    @Prop({ default: "null", })
    description: string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;
    @Prop({default:5})
    ignore_bet:string;

    @Prop({default:5})
    reject_bet:string;

    @Prop({ default: '0' })
    bet_expires_sec: string;

}
export const GamesSchema = SchemaFactory.createForClass(Games)



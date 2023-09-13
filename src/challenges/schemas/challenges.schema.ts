import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
@Schema({
    timestamps: true,
})
export class Challenges extends Document {

    @Prop({ required: true, default: "" })
    descriptions: string;

    @Prop()
    game_id: string;

    @Prop()
    challenger_id: string;

    @Prop()
    challenged_id: string;

    @Prop()
    game_title: string;
    @Prop()
    challenge_time_minutes: string;
    @Prop()
    maximum_challenges: string;
    @Prop()
    commission: string;
    @Prop()
    time_restrictions: string;

}
export const ChallengesSchema = SchemaFactory.createForClass(Challenges)



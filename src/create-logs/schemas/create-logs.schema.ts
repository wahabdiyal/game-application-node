import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";

@Schema({
    timestamps: true,
})
export class CreateLogs extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User;
    @Prop()
    url: string;

    @Prop()
    requestType: string;

    @Prop()
    ip: string;

    @Prop({ type: mongoose.Schema.Types.Mixed }) // Specify the type as Mixed
    body: JSON;

}
export const CreateLogsSchema = SchemaFactory.createForClass(CreateLogs)



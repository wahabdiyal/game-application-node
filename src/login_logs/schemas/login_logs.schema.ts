
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";
@Schema({
    timestamps: true,
})
export class LoginLogs extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User;
    @Prop({ required: true })
    ip_address: string;



}
export const LoginLogsSchema = SchemaFactory.createForClass(LoginLogs)



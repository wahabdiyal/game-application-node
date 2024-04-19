import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({
  timestamps: true,
})
///////////////Whatsapp contact//////////////////
export class Contacts extends Document {
  @Prop({ default: 'active', required: true })
  status: string;
  @Prop({ required: true })
  country: [string];
  @Prop({ required: true })
  phone: [string];
  @Prop({ required: true })
  remarks: string;

  @Prop()
  created_by: string;
  @Prop()
  updated_by: string;
}
export const ContactsSchema = SchemaFactory.createForClass(Contacts);

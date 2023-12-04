import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { sequence } from 'mongoose-sequence';
export enum UserType {
    admin = "admin",
    manager = "operator",
    user = "player"
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
function generateUniqueRandomString(length) {
    let randomString = "";
    const usedCharacters = new Set();
  
    for (let i = 0; i < length; i++) {
      let randomCharacter = randomInt(65, 90);
  
      while (usedCharacters.has(randomCharacter)) {
        randomCharacter = randomInt(65, 90);
      }
  
      usedCharacters.add(randomCharacter);
      randomString += String.fromCharCode(randomCharacter);
    }
  
    return randomString;
  }
@Schema({
    timestamps: true,
})
export class User extends Document {
    @Prop({ unique: true })
    userId: string;
    @Prop()
    full_name: string;
    @Prop()
    first_name: string;
    @Prop({ default: null })
    user_ip: string;
    @Prop({ default: 0 })
    block: string;
    @Prop()
    last_name: string;
    @Prop({ required: true })
    country: string;
    @Prop({ default: 'active' })
    status: string;



    @Prop({ required: true, unique: true })
    email: string;
    @Prop()
    password: string

    @Prop({ default: "player" })
    role: UserType;

    @Prop({ unique: true })
    phone: string;

    @Prop({ required: true, default: 0 })
    silver_balance: string;
    @Prop({ required: true, default: 0 })
    gold_balance: string;
    @Prop({ default: "" })
    file_url: string;


    @Prop({ required: true, default: true })
    allow_to_game: boolean;
    @Prop({ default: '' })
    game_restrict_at: string;
    @Prop({ default: '' })
    restriction_end_at: string; ///minutes


    @Prop({ default: 0 })
    attempts: number;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;

    @Prop({ default: [] })
    bet_block: [string];
 
    @Prop()
    deviceToken: string;

    @Prop()
    user_login_token: string;
    @Prop({unique:true})
    referral_code:string


}


export const UserSchema = SchemaFactory.createForClass(User)



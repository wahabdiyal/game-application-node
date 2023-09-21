import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

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
export class ReferralCode  extends Document{
    @Prop({required:true, default:generateUniqueRandomString(8),unique:true})
    referral_code:string;
    @Prop({default:"active", required:true})
    status:string;
    @Prop({required: true,default:0})
    user_id:string;
    @Prop({required: true,default:0})
    total_use:string;
    @Prop({required: true,default:0})
    use_date:string;

    @Prop()
    created_by: string;
    @Prop()
    updated_by: string;

 
}
export const ReferralCodeSchema = SchemaFactory.createForClass(ReferralCode)



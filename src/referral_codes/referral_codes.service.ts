import { Injectable } from '@nestjs/common';
import { CreateReferralCodeDto } from './dto/create-referral_code.dto';
import { UpdateReferralCodeDto } from './dto/update-referral_code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReferralCode } from './schemas/referral_code.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class ReferralCodesService {
  constructor(
    @InjectModel(ReferralCode.name)
    private referralModel: mongoose.Model<ReferralCode>,
  ){
  }
  create(createReferralCodeDto: CreateReferralCodeDto) {
    return 'This action adds a new referralCode';
  }

  findAll() {
    return `This action returns all referralCodes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} referralCode`;
  }

  update(id: number, updateReferralCodeDto: UpdateReferralCodeDto) {
    return `This action updates a #${id} referralCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} referralCode`;
  }
  async user_share(user){
      const checkUser = await this.referralModel.findOne({user_id: user.id});
      if(!checkUser){
         const res = await this.referralModel.create({user_id:user.id});
        return res;
      }else{
         
         return checkUser;
      }
       
  }
  async getRefWithCode(refcode){
    const ref =  await this.referralModel.findOne({referral_code:refcode});
      if(ref){
        return ref;
      }return null;
  }
}

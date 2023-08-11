import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSignupRewardDto } from './dto/create-signup_reward.dto';
import { UpdateSignupRewardDto } from './dto/update-signup_reward.dto';
import { SignupReward } from './schemas/signup-rewards.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class SignupRewardsService {
  constructor(
    @InjectModel(SignupReward.name)
    private signuprewardModel: mongoose.Model<SignupReward>,
  ){}
 async create(@Body() createSignupRewardDto: CreateSignupRewardDto) {
      const collection = await this.signuprewardModel.find().select('country');
     //   return collection;
     return createSignupRewardDto.country;
    return await this.signuprewardModel.create(createSignupRewardDto);
  }

 async findAll() {
    return await this.signuprewardModel.find() ;
  }

 async findOne(id: any) {
    return await this.signuprewardModel.findById(id);
  }

 async update(id: any, updateSignupRewardDto: UpdateSignupRewardDto) {
    const signupreward = await this.signuprewardModel.findByIdAndUpdate(id,updateSignupRewardDto);

    if (!signupreward) {
      throw new NotFoundException('signupreward Coin not found.');
    }
  
    return {status: true,message: "signup reward updated successfully"};
  }

 async remove(id: any) {
    const signupreward = await this.signuprewardModel.findByIdAndDelete(id);

    if (!signupreward) {
      throw new NotFoundException('signup reward not found.');
    }

    return {status: true,message: "signup reward Delete successfully"};
  }
  async getCoinByUserCountry( user_country:string ){
    return await this.signuprewardModel.findOne({
      country: { $in: [user_country] }
  });
  }
}

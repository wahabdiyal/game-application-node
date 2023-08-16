import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReferralRewardDto } from './dto/create-referral_reward.dto';
import { UpdateReferralRewardDto } from './dto/update-referral_reward.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReferralReward } from './schemas/referral_reward.schema';
import mongoose from 'mongoose';

@Injectable()
export class ReferralRewardsService {
  constructor(
    @InjectModel(ReferralReward.name)
    private referralModel: mongoose.Model<ReferralReward>,
    ){}

  async create(createReferralRewardDto: CreateReferralRewardDto) {
    const res = await this.referralModel.create(createReferralRewardDto);
    return res;
    
  }

 async findAll() {
    const res = await this.referralModel.find();
    return res;
  }

  async findOne(id: any) {
    const referral = await this.referralModel.findById(id);
    return referral;
  }

  async update(id: any, updateReferralRewardDto: UpdateReferralRewardDto) {
    const res = await this.referralModel.findByIdAndUpdate(id,updateReferralRewardDto);

    if (!res) {
      throw new NotFoundException('Referral reward not found.');
    }
  
    return {status: true,message: "Referral Reward updated successfully"};
  }

  async remove(id: any) {
    const ref = await this.referralModel.findByIdAndDelete(id);

    if (!ref) {
      throw new NotFoundException('referral Coin  not found.');
    }

    return {status: true,message: "referral Coin Delete successfully"};
  }
}

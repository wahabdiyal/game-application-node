import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDailyRewardDto } from './dto/create-daily_reward.dto';
import { UpdateDailyRewardDto } from './dto/update-daily_reward.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DailyReward } from './schemas/daily-rewards.schema';
import mongoose from 'mongoose';

@Injectable()
export class DailyRewardsService {
  constructor(
    @InjectModel(DailyReward.name)
    private dailyReward: mongoose.Model<DailyReward>,
    ){}

  async create(createDailyRewardDto: CreateDailyRewardDto) {
    var res = await this.dailyReward.create(createDailyRewardDto);
   return res;
  }

 async findAll(type) {
 
  if(type =="silver"){
    return await this.dailyReward.find( {silver_coin: {$ne: 0} } ).exec();
  }if(type =="gold"){
    return await this.dailyReward.find( {gold_coin:  {$ne: 0} } ).exec();
  }
  return [];
    
  }

  async findOne(id: any) {
    return await this.dailyReward.findOne({_id : id});
  }

  async update(id: any, updateDailyRewardDto: UpdateDailyRewardDto) {
    const dailyreward = await this.dailyReward.findByIdAndUpdate(id,updateDailyRewardDto);

    if (!dailyreward) {
      throw new NotFoundException('daily reward not found.');
    }

    return {status: true,message: "daily reward updated successfully"};
  }

  async remove(id: any) {
    const dailyreward = await this.dailyReward.findByIdAndDelete(id);
    if (!dailyreward) {
      throw new NotFoundException('daily reward not found.');
    }

    return {status: true,message: "daily reward delete successfully"};
  }
}

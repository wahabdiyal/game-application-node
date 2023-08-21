import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from './schemas/reward.schema';
import mongoose from 'mongoose';

@Injectable()
export class RewardService {

  constructor(
    @InjectModel(Reward.name)
    private rewardModel: mongoose.Model<Reward>,
    ){}
 
  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const res = await this.rewardModel.create(createRewardDto);
    return res;
  }

  async findAll():Promise<Reward[]>{
    const reward = await this.rewardModel.find();
    return reward;
}

  async findOne(id: any):Promise<Reward>{
    const reward = await this.rewardModel.findById(id);
    return reward;
}

async findByUserId(id: any):Promise<Reward[]>{
  const reward = await this.rewardModel.find({client_id: id});
  if (!reward) {
    throw new NotFoundException('User not found.');
  }
    return reward;
}

async update(id: any, updateRewardDto: UpdateRewardDto) {
  const reward = await this.rewardModel.findByIdAndUpdate(id,updateRewardDto);

  if (!reward) {
    throw new NotFoundException('Reward not found.');
  }

  return {status: true,message: "Reward updated successfully"};
} 
  async remove(id: any) {
    const reward = await this.rewardModel.findByIdAndDelete(id);

    if (!reward) {
      throw new NotFoundException('Reward not found.');
    }

    return {status: true,message: "Reward Delete successfully"};
  }
}

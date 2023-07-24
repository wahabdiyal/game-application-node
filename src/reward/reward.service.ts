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
  const reward = await this.rewardModel.find({user_id: id});
  if (!reward) {
    throw new NotFoundException('User not found.');
  }
    return reward;
}

  update(id: number, updateRewardDto: UpdateRewardDto) {
    return `This action updates a #${id} reward`;
  }

  async remove(id:any): Promise<Reward> {

    const deletedRecord = await this.rewardModel.findByIdAndDelete(id) ;
    return deletedRecord;
  }
}

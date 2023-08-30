import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateDailyRewardCollectDto } from './dto/create-daily_reward_collect.dto';
import { UpdateDailyRewardCollectDto } from './dto/update-daily_reward_collect.dto';
import mongoose from 'mongoose';
import { DailyRewardCollects } from './schemas/daily_reward_collects.schema';
import { UserService } from 'src/user/user.service';
import { DailyRewardsService } from 'src/daily_rewards/daily_rewards.service';
import { SilversService } from 'src/silvers/silvers.service';
import { GoldsService } from 'src/golds/golds.service';

@Injectable()
export class DailyRewardCollectsService {
  constructor(
    @InjectModel(DailyRewardCollects.name)
    private dailyRewardCollectionModel: mongoose.Model<DailyRewardCollects>,
    private userService: UserService,
    private dailyRewardService:DailyRewardsService,
    private silverService:SilversService,
    private goldService:GoldsService  
    
  ){}
  async create(createDailyRewardCollectDto: CreateDailyRewardCollectDto,user) {
    // const rewardDetail = await this.dailyRewardService.findOne()
    const rewardCollect = await this.dailyRewardCollectionModel.findOne({user_id:user.id});
    if(!rewardCollect){

    }else{

    }
      
    return user;
  }
  
  






  findAll() {
    return `This action returns all dailyRewardCollects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyRewardCollect`;
  }

  update(id: number, updateDailyRewardCollectDto: UpdateDailyRewardCollectDto) {
    return `This action updates a #${id} dailyRewardCollect`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyRewardCollect`;
  }
}

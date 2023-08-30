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
import * as moment from "moment";
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
  async create(user) {
 
      const rewardDetail = await this.dailyRewardService.findByCountry(user.country);

      const today = moment();
      const startDate = moment(rewardDetail.start_date);
      const endDate = moment(rewardDetail.end_date);
      if(!today.isBetween(startDate, endDate)){
        return false;
      }

       let  silver:any = await this.silverService.latestFirst(user.id);
        
       if(silver) {
        const date1 = moment('2023-08-30T12:19:02.127Z');
        const date2 = moment('2023-08-31T12:19:02.127Z');
        
        const areDatesEqual = date1.isSame(date2);
       }else{
        silver = false;
       }
       const gold = await this.goldService.latestFirst(user.id);
        
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

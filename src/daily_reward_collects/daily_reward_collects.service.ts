import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { DailyRewardCollects } from './schemas/daily_reward_collects.schema';
import { UserService } from 'src/user/user.service';
import { DailyRewardsService } from 'src/daily_rewards/daily_rewards.service';
import { SilversService } from 'src/silvers/silvers.service';
import { GoldsService } from 'src/golds/golds.service';
import * as moment from "moment";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron,CronExpression } from '@nestjs/schedule/dist';
 import { OnEvent } from '@nestjs/event-emitter/dist/decorators'; 
import { DailyRewardCollect } from './daily_reward_collects.event';
@Injectable()
export class DailyRewardCollectsService {
  constructor(
    @InjectModel(DailyRewardCollects.name)
    private dailyRewardCollectionModel: mongoose.Model<DailyRewardCollects>,
    private userService: UserService,
    private dailyRewardService:DailyRewardsService,
    private silverService:SilversService,
    private goldService:GoldsService,
    private readonly eventEmitter:EventEmitter2  
    
  ){}
  async create(user) {
      const rewardDetail = await this.dailyRewardService.findByCountry(user.country.toLowerCase());
     
      if(!rewardDetail){
        return {status:false, message:"Country is not available for this user."};
      }
      const rewardCollect = await this.dailyRewardCollectionModel.findOne({user_id:user.id});
      let gold:any = await this.goldService.latestFirst(user.id);
      let  silver:any = await this.silverService.latestFirst(user.id);

      
    const today = moment();
      const startDate = moment(rewardDetail.start_date);
      const endDate = moment(rewardDetail.end_date);
      if(!today.isBetween(startDate, endDate)){
        return {status:false,message:"reward not found."};
      }
       if(silver) {
        const date1 = moment(silver.createdAt);
        const date2 = moment();
        
         silver = date1.isSame(date2,"day");
       }else{
        silver = false;
       }
       if(gold) {
        const date1 = moment(gold.createdAt);
        const date2 = moment();
        
        gold = date1.isSame(date2,"day");
        
       }else{
        gold = false;
       }
     
        if( !gold &&  !silver) {
          return {status:false,message:"User transaction not found today"};
        }
    if(!rewardCollect){
        if(rewardDetail.gold_coin != '0'){
          await this.goldService.create({coins:rewardDetail.gold_coin,type:"credit",remarks:"Daily reward collect",entry_type:"admin",client_id:user.id})
        }
        if(rewardDetail.silver_coin != '0'){
          await this.silverService.create({coins:rewardDetail.silver_coin,type:"credit",remarks:"Daily reward collect",entry_type:"admin",client_id:user.id})
        }

      const dailyre =   await this.dailyRewardCollectionModel.create({user_id:user.id,total_reward:rewardDetail.inactive_day,reward_count:1,date:moment(),country:user.country});
      return {...await this.userService.getUserRenewTokenForMobile(user['id']),dailyReward:dailyre,

    };
    }else{
      if(rewardCollect.reward_count<rewardDetail.inactive_day){
        return {status:false,message:"User Found in request."};
      }
     
    }
 
  }

  async checkCollectUser(user) : Promise<boolean>{
     
      const value =  await this.dailyRewardCollectionModel.findOne({user_id:user.id});
      return (value==null)?true:false;
  }
  async getCollectUser(user) {
     
    const dailyCollection =  await this.dailyRewardCollectionModel.findOne({user_id:user.id});
            if(dailyCollection){
              return {status:true,reward:dailyCollection};
            }else{
              return {status:false,message:"User not found in reward collection"};
            }
}
  
  /////////Action Cron and Event///////////////

  @Cron(CronExpression.EVERY_DAY_AT_1AM,{name:"send-daily-rewards"})
 async sendRequest(){
    
    this.eventEmitter.emit(
      'daily.rewards',
      new DailyRewardCollect(),
    );
      console.log("send request.....");
  }
  @OnEvent("daily.rewards")
 async eventDailyReward(payload:DailyRewardCollect){
    const userDailyReward:any = await this.getAllDailyRewardCollects();
    for (let c = 0; c < userDailyReward.length; c++) {
         const rewardDetailAdmin = await this.dailyRewardService.findByCountry(userDailyReward[c].country);
        //  current date match//
        const today = moment();
        const startDate = moment(rewardDetailAdmin.start_date);
        const endDate = moment(rewardDetailAdmin.end_date);
        if(!today.isBetween(startDate, endDate)){
          console.log("continue........");
          //// admin side can add field expired entry status then we jsut fetch active daily reward entries///and now i don't remember
          continue;
        }
         if(Number(userDailyReward[c].reward_count) < Number(rewardDetailAdmin.inactive_day)){
            ///////////////////////// update daily reward package update//////////////////
            if(rewardDetailAdmin.gold_coin != '0'){
              await this.goldService.create({coins:rewardDetailAdmin.gold_coin,type:"credit",remarks:"Daily reward collect",entry_type:"admin",client_id:userDailyReward[c].user_id})
            }
            if(rewardDetailAdmin.silver_coin != '0'){
              await this.silverService.create({coins:rewardDetailAdmin.silver_coin,type:"credit",remarks:"Daily reward collect",entry_type:"admin",client_id:userDailyReward[c].user_id})
            }
            console.log(userDailyReward[c].user_id,userDailyReward[c].country);

             await this.dailyRewardCollectionModel.updateOne({user_id:userDailyReward[c].user_id},{reward_count:Number(userDailyReward[c].reward_count)+1,date:moment(),country:userDailyReward[c].country});
         }else{
          console.log("continue");
          continue;
         }
          
      
    }
       return payload.getUserDailyReward();
        
  }

  async getAllDailyRewardCollects(): Promise<DailyRewardCollect[]>{
   return await this.dailyRewardCollectionModel.find();
  }

 
}

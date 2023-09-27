import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { DailyRewardCollectsService } from './daily_reward_collects.service';
import { UpdateDailyRewardCollectDto } from './dto/update-daily_reward_collect.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('daily-reward-collects')
export class DailyRewardCollectsController {
  constructor(private readonly dailyRewardCollectsService: DailyRewardCollectsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req) {
    const value = await this.dailyRewardCollectsService.checkCollectUser(req.user) ;
      if(value) { 
         return this.dailyRewardCollectsService.create(req.user);
      }else{
        return {status:false,message:"Already reward taken."};
      }

      
    
  }
 
}

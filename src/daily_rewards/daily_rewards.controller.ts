import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyRewardsService } from './daily_rewards.service';
import { CreateDailyRewardDto } from './dto/create-daily_reward.dto';
import { UpdateDailyRewardDto } from './dto/update-daily_reward.dto';

@Controller('daily-rewards')
export class DailyRewardsController {
  constructor(private readonly dailyRewardsService: DailyRewardsService) {}

  @Post()
  create(@Body() createDailyRewardDto: CreateDailyRewardDto) {
    return this.dailyRewardsService.create(createDailyRewardDto);
  }

  @Get("get-all/:type")
  findAll(@Param() type: string) {
 
    return this.dailyRewardsService.findAll(type['type']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyRewardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyRewardDto: UpdateDailyRewardDto) {
    return this.dailyRewardsService.update(id, updateDailyRewardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyRewardsService.remove(id);
  }
}

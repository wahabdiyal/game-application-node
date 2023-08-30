import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { DailyRewardCollectsService } from './daily_reward_collects.service';
import { CreateDailyRewardCollectDto } from './dto/create-daily_reward_collect.dto';
import { UpdateDailyRewardCollectDto } from './dto/update-daily_reward_collect.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('daily-reward-collects')
export class DailyRewardCollectsController {
  constructor(private readonly dailyRewardCollectsService: DailyRewardCollectsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req) {
    return this.dailyRewardCollectsService.create(req.user);
  }

  @Get()
  findAll() {
    return this.dailyRewardCollectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyRewardCollectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyRewardCollectDto: UpdateDailyRewardCollectDto) {
    return this.dailyRewardCollectsService.update(+id, updateDailyRewardCollectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyRewardCollectsService.remove(+id);
  }
}

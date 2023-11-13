import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { DailyRewardsService } from './daily_rewards.service';
import { CreateDailyRewardDto } from './dto/create-daily_reward.dto';
import { UpdateDailyRewardDto } from './dto/update-daily_reward.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('daily-rewards')
@UseGuards(AuthGuard)
export class DailyRewardsController {
  constructor(private readonly dailyRewardsService: DailyRewardsService) {}

  @Post()
  create(@Body() createDailyRewardDto: CreateDailyRewardDto) {
    return this.dailyRewardsService.create(createDailyRewardDto);
  }

  @Get("get-all/:type")
  findAll(@Request() req,@Param() type: string) { 
    return this.dailyRewardsService.findAll(type['type'],req.user.role,req.user.country);
  }
  @Get("get-all-types/all")
  findAllTypes(@Request() req) { 
    return this.dailyRewardsService.findAllTypes(req.user.role,req.user.country);
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
  @Get('mobile/:country')
  findForMobile(@Param('country') country: string) {
    return this.dailyRewardsService.findForMobile(country.toLowerCase());
  }
}

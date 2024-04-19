import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReferralRewardsService } from './referral_rewards.service';
import { CreateReferralRewardDto } from './dto/create-referral_reward.dto';
import { UpdateReferralRewardDto } from './dto/update-referral_reward.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('referral-rewards')
@UseGuards(AuthGuard)
export class ReferralRewardsController {
  constructor(
    private readonly referralRewardsService: ReferralRewardsService,
  ) {}

  @Post()
  create(@Body() createReferralRewardDto: CreateReferralRewardDto) {
    return this.referralRewardsService.create(createReferralRewardDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.referralRewardsService.findAll(req.user.role, req.user.country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referralRewardsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReferralRewardDto: UpdateReferralRewardDto,
  ) {
    return this.referralRewardsService.update(id, updateReferralRewardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referralRewardsService.remove(id);
  }
}

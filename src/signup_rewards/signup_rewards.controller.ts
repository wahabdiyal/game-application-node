import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignupRewardsService } from './signup_rewards.service';
import { CreateSignupRewardDto } from './dto/create-signup_reward.dto';
import { UpdateSignupRewardDto } from './dto/update-signup_reward.dto';
 

@Controller('signup-rewards')
export class SignupRewardsController {
  constructor(private readonly signupRewardsService: SignupRewardsService) {}

  @Post()
  create(@Body() createSignupRewardDto: CreateSignupRewardDto) {
    return this.signupRewardsService.create(createSignupRewardDto);
  }
  @Get()
  findAll() {
    return this.signupRewardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.signupRewardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateSignupRewardDto: UpdateSignupRewardDto) {
    return this.signupRewardsService.update(id, updateSignupRewardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.signupRewardsService.remove(id);
  }
}

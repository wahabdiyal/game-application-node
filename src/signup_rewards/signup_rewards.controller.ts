import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards } from '@nestjs/common';
import { SignupRewardsService } from './signup_rewards.service';
import { CreateSignupRewardDto } from './dto/create-signup_reward.dto';
import { UpdateSignupRewardDto } from './dto/update-signup_reward.dto';
import { AuthGuard } from 'src/auth/auth.guard';
 

@Controller('signup-rewards')
@UseGuards(AuthGuard)
export class SignupRewardsController {
  constructor(private readonly signupRewardsService: SignupRewardsService) {}

  @Post()
  create(@Body() createSignupRewardDto: CreateSignupRewardDto) {
    return this.signupRewardsService.create(createSignupRewardDto);
  }
  @Get()
  findAll(@Request() req) {
    return this.signupRewardsService.findAll(req.user.role,req.user.country);
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

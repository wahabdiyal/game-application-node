import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { WithdrawLimitsService } from './withdraw_limits.service';
import { CreateWithdrawLimitDto } from './dto/create-withdraw_limit.dto';
import { UpdateWithdrawLimitDto } from './dto/update-withdraw_limit.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('withdraw-limits')
@UseGuards(AuthGuard)
export class WithdrawLimitsController {
  constructor(private readonly withdrawLimitsService: WithdrawLimitsService) { }

  @Post()
  create(@Body() createWithdrawLimitDto: CreateWithdrawLimitDto) {
    return this.withdrawLimitsService.create(createWithdrawLimitDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.withdrawLimitsService.findAll(req.user.role,req.user.country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawLimitsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateWithdrawLimitDto: UpdateWithdrawLimitDto) {
    return this.withdrawLimitsService.update(id, updateWithdrawLimitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawLimitsService.remove(id);
  }
  @Get('country/:id')
  findOneByCountry(@Param('id') id: string) {
    return this.withdrawLimitsService.findOneByCountry(id);
  }
  @Get('mobile/country/:id')
  findOneByCountryMobile(@Param('id') id: string) {
    return this.withdrawLimitsService.findOneByCountryMobile(id.toLowerCase());
  }


}

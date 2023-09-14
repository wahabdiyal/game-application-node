import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WithdrawLimitsService } from './withdraw_limits.service';
import { CreateWithdrawLimitDto } from './dto/create-withdraw_limit.dto';
import { UpdateWithdrawLimitDto } from './dto/update-withdraw_limit.dto';

@Controller('withdraw-limits')
export class WithdrawLimitsController {
  constructor(private readonly withdrawLimitsService: WithdrawLimitsService) { }

  @Post()
  create(@Body() createWithdrawLimitDto: CreateWithdrawLimitDto) {
    return this.withdrawLimitsService.create(createWithdrawLimitDto);
  }

  @Get()
  findAll() {
    return this.withdrawLimitsService.findAll();
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
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.withdrawService.create(createWithdrawDto);
  }

  @Get()
  findAll() {
    return this.withdrawService.findAll();
  }
  @Get('user-request/:id')
  userRequest(@Param('id') id: any) {
    return this.withdrawService.userRequest(id);
  }
  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.withdrawService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateWithdrawDto: UpdateWithdrawDto) {
    return this.withdrawService.update(id, updateWithdrawDto);
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.withdrawService.remove(id);
  }
}

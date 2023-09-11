import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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
  findAll(@Query() {page,perpage,start_date,end_date,status}) {
    let date = (start_date && end_date)?[{start:start_date,end:end_date}]:[];
    return this.withdrawService.findAll(page, perpage,date,status);
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
  @Get('get/approve/request')
  sumOfWithdraw(@Query() {skip,limit}){
    return this.withdrawService.sumOfWithdraw( skip,limit );
  }
  @Get('getbystatus/:status')
  getRecordWithStatus(@Param('status') status){
    return this.withdrawService.getRecordWithStatus(status);
  }
}

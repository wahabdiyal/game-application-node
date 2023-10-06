import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService,
              ) {}

  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.withdrawService.create(createWithdrawDto);
  }
  @UseGuards(AuthGuard)
  @Post('request/mobile')

  @UseInterceptors(FileInterceptor("form-data"))
  async mobilerequest(@Body() createWithdrawDto: CreateWithdrawDto , @Request() req) {
   
    const requestwithdraw = await this.withdrawService.getLimitWithdraw(req.user.country);
 
    if(requestwithdraw && Number(requestwithdraw['max_gold_coin'])>=Number(createWithdrawDto['coins']) && Number(requestwithdraw['min_gold_coin'])<=Number(createWithdrawDto['coins'])){
       const withDraw = await this.withdrawService.createWithdrawRequest({
      "status": "pending",
      "client_id":req.user.id,
      "coins": createWithdrawDto['coins'],
      "remarks":"Request for withdraw coins",
       "total_amount":requestwithdraw['min_gold_coin'],
        "admin_commission":requestwithdraw['percentage'],
         "withdraw_amount":requestwithdraw['max_gold_coin']
      
  });
  return {status:true,message:"Withdrawal request completed successfully",data:withDraw};
    }else{
      return { status:false, message:"Country is not available"};
    }
   
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

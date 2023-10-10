import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RechargeAdminWalletsService } from './recharge-admin-wallets.service';
import { CreateRechargeAdminWalletDto } from './dto/create-recharge-admin-wallet.dto';
import { UpdateRechargeAdminWalletDto } from './dto/update-recharge-admin-wallet.dto';

@Controller('recharge-admin-wallets')
export class RechargeAdminWalletsController {
  constructor(private readonly rechargeAdminWalletsService: RechargeAdminWalletsService) { }


  ///by admin
  @Post()
  create(@Body() createRechargeAdminWalletDto: CreateRechargeAdminWalletDto) {
    return this.rechargeAdminWalletsService.create(createRechargeAdminWalletDto);
  }

 

  @Get()
  findAll() {
    return this.rechargeAdminWalletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rechargeAdminWalletsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateRechargeAdminWalletDto: UpdateRechargeAdminWalletDto) {
    return this.rechargeAdminWalletsService.update(id, updateRechargeAdminWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rechargeAdminWalletsService.remove(id);
  }
  @Get('country/:id')
  findOneByCountry(@Param('id') id: string) {
    return this.rechargeAdminWalletsService.findOneByCountry(id);
  }
}

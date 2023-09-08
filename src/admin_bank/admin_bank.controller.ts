import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminBankService } from './admin_bank.service';
import { CreateAdminBankDto } from './dto/create-admin_bank.dto';
import { UpdateAdminBankDto } from './dto/update-admin_bank.dto';

@Controller('admin-bank')
export class AdminBankController {
  constructor(private readonly adminBankService: AdminBankService) {}

  @Post()
  create(@Body() createAdminBankDto: CreateAdminBankDto) {
    return this.adminBankService.create(createAdminBankDto);
  }

  @Get()
  findAll() {
    return this.adminBankService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminBankService.findOne(id);
  }

  @Get('/country/:country')
  findOneCountry(@Param('country') country: string) {
    return this.adminBankService.findOneCountry(country);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminBankDto: UpdateAdminBankDto) {
    return this.adminBankService.update(id, updateAdminBankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminBankService.remove(id);
  }
}

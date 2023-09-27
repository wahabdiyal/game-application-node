import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AdminAccountsService } from './admin_accounts.service';
import { CreateAdminAccountDto } from './dto/create-admin_account.dto';
import { UpdateAdminAccountDto } from './dto/update-admin_account.dto';

@Controller('admin-accounts')
export class AdminAccountsController {
  constructor(private readonly adminAccountsService: AdminAccountsService) {}

  @Post()
  create(@Body() createAdminAccountDto: CreateAdminAccountDto) {
    return this.adminAccountsService.create(createAdminAccountDto);
  }

  @Get()
  findAll() {
    return this.adminAccountsService.findAll();
  }

  @Get("commission")
  getAllCommission(@Query() { page, perpage, game_id}) {
    return this.adminAccountsService.findAllCommission(page,perpage,game_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminAccountsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminAccountDto: UpdateAdminAccountDto) {
    return this.adminAccountsService.update(id, updateAdminAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminAccountsService.remove(id);
  }
}

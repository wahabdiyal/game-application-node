import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserBanksService } from './user_banks.service';
import { CreateUserBankDto } from './dto/create-user_bank.dto';
import { UpdateUserBankDto } from './dto/update-user_bank.dto';

@Controller('user-banks')
export class UserBanksController {
  constructor(private readonly userBanksService: UserBanksService) {}

  @Post()
  create(@Body() createUserBankDto: CreateUserBankDto) {
    return this.userBanksService.create(createUserBankDto);
  }

  @Get()
  findAll() {
    return this.userBanksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBanksService.findOne(id);
  }
  @Get('/user/:id')
  findOneUser(@Param('id') id: string) {
    return this.userBanksService.findOneUser(id);
  }

  @Get('/selectedWallet/:id')
  findOneUserSelected(@Param('id') id: string) {
    return this.userBanksService.findOneUserSelected(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserBankDto: UpdateUserBankDto) {
    return this.userBanksService.update(id, updateUserBankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBanksService.remove(id);
  }
}

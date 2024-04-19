import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserBanksService } from './user_banks.service';
import { CreateUserBankDto } from './dto/create-user_bank.dto';
import { UpdateUserBankDto } from './dto/update-user_bank.dto';

@Controller('user-banks-mobile')
export class UserBankMobileController {
  constructor(private readonly userBanksService: UserBanksService) {}

  @Post()
  async create(@Body() createUserBankDto: CreateUserBankDto) {
    const bank = await this.userBanksService.create(createUserBankDto);
    return { status: true, bank_detail: bank };
  }

  @Get('all/user/:user_id')
  async findAll(@Param('user_id') id) {
    const bank = await this.userBanksService.findOneUser(id);
    if (bank.length > 0) {
      return { status: true, bank_detail: bank };
    } else {
      return { status: false, message: 'Bank is not found.' };
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const bank = await this.userBanksService.findOne(id);
    if (bank) {
      return { status: true, bankdetail: bank };
    } else {
      return { status: false, message: 'bank is not found.' };
    }
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserBankDto: UpdateUserBankDto,
  ) {
    return this.userBanksService.update(id, updateUserBankDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBanksService.remove(id);
  }
}

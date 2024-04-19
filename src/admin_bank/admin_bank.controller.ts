import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminBankService } from './admin_bank.service';
import { CreateAdminBankDto } from './dto/create-admin_bank.dto';
import { UpdateAdminBankDto } from './dto/update-admin_bank.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('admin-bank')
@UseGuards(AuthGuard)
export class AdminBankController {
  constructor(private readonly adminBankService: AdminBankService) {}

  @Post()
  create(@Body() createAdminBankDto: CreateAdminBankDto) {
    return this.adminBankService.create(createAdminBankDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.adminBankService.findAll(req.user.role, req.user.country);
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
  update(
    @Param('id') id: string,
    @Body() updateAdminBankDto: UpdateAdminBankDto,
  ) {
    return this.adminBankService.update(id, updateAdminBankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminBankService.remove(id);
  }

  @Get('/country/mobile/:country')
  findOneCountryForMobile(@Param('country') country: string) {
    return this.adminBankService.findOneCountryForMobile(country.toLowerCase());
  }
}

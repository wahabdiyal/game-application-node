import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards } from '@nestjs/common';
import { CryptoWalletsService } from './crypto_wallets.service';
import { CreateCryptoWalletDto } from './dto/create-crypto_wallet.dto';
import { UpdateCryptoWalletDto } from './dto/update-crypto_wallet.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('crypto-wallets')
@UseGuards(AuthGuard)
export class CryptoWalletsController {
  constructor(private readonly cryptoWalletsService: CryptoWalletsService) {}

  @Post()
  create(@Body() createCryptoWalletDto: CreateCryptoWalletDto) {
    return this.cryptoWalletsService.create(createCryptoWalletDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.cryptoWalletsService.findAll(req.user.role,req.user.country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cryptoWalletsService.findOne(id);
  }

  @Get('/country/:country')
  findByCountry(@Param('country') country: string) {
    return this.cryptoWalletsService.findByCountry(country);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCryptoWalletDto: UpdateCryptoWalletDto) {
    return this.cryptoWalletsService.update(id, updateCryptoWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cryptoWalletsService.remove(id);
  }
  @Get('/country/mobile/:country')
  findByCountryForMobile(@Param('country') country: string) {
    return this.cryptoWalletsService.findByCountryForMobile(country);
  }

}

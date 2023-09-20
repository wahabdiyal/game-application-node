import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CryptoWalletsService } from './crypto_wallets.service';
import { CreateCryptoWalletDto } from './dto/create-crypto_wallet.dto';
import { UpdateCryptoWalletDto } from './dto/update-crypto_wallet.dto';

@Controller('crypto-wallets')
export class CryptoWalletsController {
  constructor(private readonly cryptoWalletsService: CryptoWalletsService) {}

  @Post()
  create(@Body() createCryptoWalletDto: CreateCryptoWalletDto) {
    return this.cryptoWalletsService.create(createCryptoWalletDto);
  }

  @Get()
  findAll() {
    return this.cryptoWalletsService.findAll();
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
}

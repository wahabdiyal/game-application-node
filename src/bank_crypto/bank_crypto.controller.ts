import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankCryptoService } from './bank_crypto.service';
 

@Controller('bank-crypto')
export class BankCryptoController {
  constructor(private readonly bankCryptoService: BankCryptoService) {}
  @Get("admin/:country")
  findAll(@Param('country') country: string) {
    return this.bankCryptoService.findAll(country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  
    return this.bankCryptoService.findOne(id);
  }

  
}

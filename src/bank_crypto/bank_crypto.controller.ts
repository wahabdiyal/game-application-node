import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankCryptoService } from './bank_crypto.service';
 

@Controller('bank-crypto')
export class BankCryptoController {
  constructor(private readonly bankCryptoService: BankCryptoService) {}
  @Get()
  findAll() {
    return this.bankCryptoService.findAll();
  }

  @Get(':country')
  findOne(@Param('country') country: string) {
    return this.bankCryptoService.findOne('',country);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CryptoValuesService } from './crypto-values.service';
import { CreateCryptoValueDto } from './dto/create-crypto-value.dto';
import { UpdateCryptoValueDto } from './dto/update-crypto-value.dto';

@Controller('crypto-values')
export class CryptoValuesController {
  constructor(private readonly cryptoValuesService: CryptoValuesService) { }

  @Post()
  create() {
    return this.cryptoValuesService.create();
  }
  @Get()
  get() {
    return this.cryptoValuesService.get();
  }

}

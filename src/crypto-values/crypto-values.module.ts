import { Module } from '@nestjs/common';
import { CryptoValuesService } from './crypto-values.service';
import { CryptoValuesController } from './crypto-values.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoValuesScheme } from './schemas/crypto-values.schema';
import { HttpModule } from '@nestjs/axios';
import { CryptoWalletsModule } from 'src/crypto_wallets/crypto_wallets.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'CryptoValues', schema: CryptoValuesScheme }]), HttpModule, CryptoWalletsModule],
  controllers: [CryptoValuesController],
  providers: [CryptoValuesService],
  exports: [CryptoValuesService],
})

export class CryptoValuesModule { }

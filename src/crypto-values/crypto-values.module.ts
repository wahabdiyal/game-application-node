import { Module } from '@nestjs/common';
import { CryptoValuesService } from './crypto-values.service';
import { CryptoValuesController } from './crypto-values.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoValuesScheme } from './schemas/crypto-values.schema';
import { HttpModule } from '@nestjs/axios';
import { CryptoWalletSchema } from 'src/crypto_wallets/schemas/crypto_wallets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CryptoValues', schema: CryptoValuesScheme },
      { name: 'CryptoWallet', schema: CryptoWalletSchema },
    ]),
    HttpModule,
  ],
  controllers: [CryptoValuesController],
  providers: [CryptoValuesService],
  exports: [CryptoValuesService],
})
export class CryptoValuesModule {}

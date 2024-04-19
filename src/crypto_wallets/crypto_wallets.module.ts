import { Module } from '@nestjs/common';
import { CryptoWalletsService } from './crypto_wallets.service';
import { CryptoWalletsController } from './crypto_wallets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoWalletSchema } from './schemas/crypto_wallets.schema';
import { CryptoValuesModule } from 'src/crypto-values/crypto-values.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CryptoWallet', schema: CryptoWalletSchema },
    ]),
    CryptoValuesModule,
  ],
  controllers: [CryptoWalletsController],
  providers: [CryptoWalletsService],
  exports: [CryptoWalletsService],
})
export class CryptoWalletsModule {}

import { Module } from '@nestjs/common';
import { CryptoWalletsService } from './crypto_wallets.service';
import { CryptoWalletsController } from './crypto_wallets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoWalletSchema } from './schemas/crypto_wallets.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'CryptoWallet', schema: CryptoWalletSchema }]) ],
  controllers: [CryptoWalletsController],
  providers: [CryptoWalletsService],
})
export class CryptoWalletsModule {}

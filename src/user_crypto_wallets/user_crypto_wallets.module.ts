import { Module } from '@nestjs/common';
import { UserCryptoWalletsService } from './user_crypto_wallets.service';
import { UserCryptoWalletsController } from './user_crypto_wallets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCryptoWalletSchema } from './schemas/user_crypto_wallet.schema';
import { UserBankSchema } from 'src/user_banks/schemas/user_banks.schema';
import { UserCryptoWalletsMobileController } from './user_crypto_wallets_mobile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserCryptoWallet', schema: UserCryptoWalletSchema },
      { name: 'UserBank', schema: UserBankSchema },
    ]),
  ],
  controllers: [UserCryptoWalletsController, UserCryptoWalletsMobileController],
  providers: [UserCryptoWalletsService],
  exports: [UserCryptoWalletsService],
})
export class UserCryptoWalletsModule {}

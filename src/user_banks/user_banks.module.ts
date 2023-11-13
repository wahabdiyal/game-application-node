import { Module } from '@nestjs/common';
import { UserBanksService } from './user_banks.service';
import { UserBanksController } from './user_banks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserBankSchema } from './schemas/user_banks.schema';
import { UserCryptoWalletsModule } from 'src/user_crypto_wallets/user_crypto_wallets.module';
import { UserCryptoWalletSchema } from 'src/user_crypto_wallets/schemas/user_crypto_wallet.schema';
import { UserBankMobileController } from './user_bank_mobile.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'UserBank', schema: UserBankSchema },
    { name: "UserCryptoWallet", schema: UserCryptoWalletSchema }
  ])],
  controllers: [UserBanksController,UserBankMobileController],
  providers: [UserBanksService],
  exports: [UserBanksService],
})
export class UserBanksModule { }

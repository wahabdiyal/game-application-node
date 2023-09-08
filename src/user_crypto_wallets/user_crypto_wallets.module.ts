import { Module } from '@nestjs/common';
import { UserCryptoWalletsService } from './user_crypto_wallets.service';
import { UserCryptoWalletsController } from './user_crypto_wallets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCryptoWalletSchema } from './schemas/user_crypto_wallet.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"UserCryptoWallet",schema:UserCryptoWalletSchema}])],
  controllers: [UserCryptoWalletsController],
  providers: [UserCryptoWalletsService],
  exports: [UserCryptoWalletsService],
})
export class UserCryptoWalletsModule {}

import { Module } from '@nestjs/common';
import { BankCryptoService } from './bank_crypto.service';
import { BankCryptoController } from './bank_crypto.controller';
import { UserBanksModule } from 'src/user_banks/user_banks.module';
import { UserCryptoWalletsModule } from 'src/user_crypto_wallets/user_crypto_wallets.module';

@Module({
  imports:[UserBanksModule,UserCryptoWalletsModule],
  controllers: [BankCryptoController],
  providers: [BankCryptoService],
  exports: [BankCryptoService],
})
export class BankCryptoModule {}

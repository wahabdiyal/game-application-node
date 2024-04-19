import { UserBanksService } from './../user_banks/user_banks.service';
import { Injectable } from '@nestjs/common';
import { AdminBankService } from 'src/admin_bank/admin_bank.service';
import { CryptoWalletsService } from 'src/crypto_wallets/crypto_wallets.service';

import { UserCryptoWalletsService } from 'src/user_crypto_wallets/user_crypto_wallets.service';

@Injectable()
export class BankCryptoService {
  constructor(
    private bankService: UserBanksService,
    private cryptoService: UserCryptoWalletsService,
    private adminBankSerivce: AdminBankService,
    private adminCryptoService: CryptoWalletsService,
  ) {}

  async findAll(country: string) {
    const bank = await this.adminBankSerivce.findByCountry(country);
    const crypto = await this.adminCryptoService.findByCountry(country);

    return {
      status: 'true',
      admin_bank: bank,
      admin_crypto: crypto,
    };
  }

  async findOne(user_id: string) {
    const bank = await this.bankService.findByUser(user_id);
    const crypto = await this.cryptoService.findByUser(user_id);

    return {
      status: 'true',
      user_bank: bank,
      user_crypto: crypto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} bankCrypto`;
  }
}

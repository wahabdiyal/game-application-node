import { UserBanksService } from './../user_banks/user_banks.service';
import { Injectable } from '@nestjs/common';
 
import { UserCryptoWalletsService } from 'src/user_crypto_wallets/user_crypto_wallets.service';
 
@Injectable()
export class BankCryptoService {
  constructor(
    private bankService:UserBanksService,
    private cryptoService:UserCryptoWalletsService
  ){}

  findAll() {
    return `This action returns all bankCrypto`;
  }

 async findOne(user_id:string , country: string) {
      return {
        status:"true",
        user_bank:await this.bankService.findByCountry(user_id,country),
        user_crypto:await this.cryptoService.findByCountry(user_id,country),
      }
  }

  

  remove(id: number) {
    return `This action removes a #${id} bankCrypto`;
  }
}

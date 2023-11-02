import { Injectable } from '@nestjs/common';
import { CreateCryptoValueDto } from './dto/create-crypto-value.dto';
import { UpdateCryptoValueDto } from './dto/update-crypto-value.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { CryptoValues } from './schemas/crypto-values.schema';
import { CryptoWallet } from 'src/crypto_wallets/schemas/crypto_wallets.schema';
import { CryptoWalletsService } from 'src/crypto_wallets/crypto_wallets.service';

@Injectable()
export class CryptoValuesService {
  constructor(
    @InjectModel(CryptoValues.name)
    private cryptoValuesModal: mongoose.Model<CryptoValues>,
    private adminCryptoService: CryptoWalletsService,
    private httpService: HttpService
  ) { }
  async create() {
    try {
      const coins_codes = (await this.adminCryptoService.allCountriesCoinsCodes()).join(';')
      const response = await this.httpService.get('https://rest.coinapi.io/v1/assets?filter_asset_id=' + coins_codes + '&apikey=73A274D9-99FF-4D04-90D2-7CA74399F555').toPromise();
      const walletDetails = response.data;


      ///remove all previous trd;
      await this.cryptoValuesModal.deleteMany({});
      //////create new details
      for (const element of walletDetails) {
        await this.cryptoValuesModal.create({
          price_usd: element.price_usd,
          wallet_no: "element.asd",
          wallet_name: "element",
          coinsCode: "element",
          coinName: "element",
          country: "element"
        });
      }
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }

  async get() {
    try {
      const data = await this.cryptoValuesModal.find({});
      const modifiedData = data.map((item: any) => ({
        wallet_no: item.transaction_id,
        wallet_name: item.gold,
        coinsCode: item.game_id,
        coinName: item.winner,
        price_usd: item.createdAt
      }));
      return { status: true, message: "crypto wallet found for this country", walletList: [] };
    } catch (error) {
      return { status: true, message: error.message, walletList: [] };
    }
  }

}

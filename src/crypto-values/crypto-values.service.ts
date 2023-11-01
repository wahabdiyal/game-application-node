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
      const coins_codes = (await this.adminCryptoService.allCoinsCodes()).join(';')
      const response = await this.httpService.get('https://rest.coinapi.io/v1/assets?filter_asset_id=' + coins_codes + '&apikey=73A274D9-99FF-4D04-90D2-7CA74399F555').toPromise();
      ///remove all previous trd;
      await this.cryptoValuesModal.deleteMany({});
      //////create new details
      await this.cryptoValuesModal.create({ list: response.data });
      return {};
    } catch (error) {
      return error.message
    }
  }
  async get() {
    try {
      const data = await this.cryptoValuesModal.find({});
      // const modifiedData = data.map((item: any) => ({
      //   transaction_id: item.transaction_id,
      //   gold: item.gold,
      //   gamedetail: item.game_id,
      //   user_coins: item.winner == _id ? item.user_coins : item.gold,
      //   createdAt: item.createdAt,
      //   status: item.winner == _id ? 'won' : 'lost',
      // }));
      return {};
    } catch (error) {
      return error.message
    }
  }

}

import { Injectable } from '@nestjs/common';
import { CreateCryptoValueDto } from './dto/create-crypto-value.dto';
import { UpdateCryptoValueDto } from './dto/update-crypto-value.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { CryptoValues } from './schemas/crypto-values.schema';
import { CryptoWallet } from 'src/crypto_wallets/schemas/crypto_wallets.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class CryptoValuesService {
  constructor(
    @InjectModel(CryptoValues.name)
    private cryptoValuesModal: mongoose.Model<CryptoValues>,
    @InjectModel(CryptoWallet.name)
    private cryptoWalletService: mongoose.Model<CryptoWallet>,
    private httpService: HttpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  @Cron(CronExpression.EVERY_9_HOURS, { name: 'calculate_crypto_codes.values' })
  async sendRequest() {
    this.eventEmitter.emit('crypto_codes.values');
    console.log('cron run successfully');
  }
  async create() {
    return this.calculateAllCodesValues();
  }
  @OnEvent('crypto_codes.values')
  async calculateAllCodesValues() {
    try {
      const coins_codes = (await this.allCoinsCodes()).join(';');
      const countryCoinsCodes = await this.allCountriesCoinsCodes();
      const response = await this.httpService
        .get(
          'https://rest.coinapi.io/v1/assets?filter_asset_id=' +
            coins_codes +
            '&apikey=73A274D9-99FF-4D04-90D2-7CA74399F555',
        )
        .toPromise();
      const walletDetails = response.data;

      ///remove all previous trd;
      await this.cryptoValuesModal.deleteMany({});
      //////create new details
      for (const element of countryCoinsCodes) {
        const obj = walletDetails.find(
          (asset: any) => asset.asset_id === element.coins_code,
        );
        if (obj) {
          await this.cryptoValuesModal.create({
            price_usd: obj.price_usd,
            wallet_no: element.wallet_no,
            wallet_name: element.wallet_name,
            coins_code: element.coins_code,
            coins_name: element.coins_name,
            country: element.country,
          });
        }
      }
      console.log('crypto values calculated');
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }

  async get(country: string) {
    try {
      const data = await this.cryptoValuesModal.find({
        country: { $regex: country, $options: 'i' },
      });
      if (data.length)
        return {
          status: true,
          message: 'crypto wallet found for this country',
          walletList: data,
        };
      else
        return {
          status: false,
          message: 'crypto wallet not found for this country',
          walletList: [],
        };
    } catch (error) {
      return { status: false, message: error.message, walletList: [] };
    }
  }

  async allCoinsCodes() {
    const list = await this.cryptoWalletService.find();
    const coin_codes = [];
    list.forEach((element: any) => {
      element.wallet_detail.forEach((el) => {
        if (!coin_codes.includes(el['coins_code']))
          coin_codes.push(el['coins_code']);
      });
    });
    return coin_codes;
  }
  async allCountriesCoinsCodes() {
    const list = await this.cryptoWalletService.find();
    const coin_codes = [];
    const my_list = [];
    list.forEach((element: any) => {
      element.country.forEach((region) => {
        element.wallet_detail.forEach((el) => {
          const obj = region + ',' + el['coins_code'];
          if (!coin_codes.includes(obj)) {
            coin_codes.push(obj);
            my_list.push({
              wallet_no: el['wallet_no'],
              wallet_name: el['wallet_name'],
              coins_name: el['coins_name'],
              coins_code: el['coins_code'],
              country: region,
            });
          }
        });
      });
    });
    return my_list;
  }
}

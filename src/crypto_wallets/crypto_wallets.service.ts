import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCryptoWalletDto } from './dto/create-crypto_wallet.dto';
import { UpdateCryptoWalletDto } from './dto/update-crypto_wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CryptoWallet } from './schemas/crypto_wallets.schema';
import mongoose from 'mongoose';

@Injectable()
export class CryptoWalletsService {
  constructor(
    @InjectModel(CryptoWallet.name)
    private cryptoWalletService: mongoose.Model<CryptoWallet>,
  ) { }
  async create(createCryptoWalletDto: CreateCryptoWalletDto) {

    const countries = await this.cryptoWalletService.findOne({ country: { $in: createCryptoWalletDto['country'] } });
    if (countries) {
      return { status: false, message: "country is already exist in list." };
    }
    var res = await this.cryptoWalletService.create(createCryptoWalletDto);
    return res;
  }

  async findByCountry(ctry: string) {
    return await this.cryptoWalletService.find({ country: { $in: [ctry] } });
  }

  async findAll() {
    return await this.cryptoWalletService.find();
  }

  async findOne(id: any) {
    return await this.cryptoWalletService.findOne({ _id: id });
  }


  async findOneCountry(country: any) {
    return await this.cryptoWalletService.findOne({
      country: {
        $in: [country]
      }
    });
  }

  async update(id: any, updateCryptoWalletDto: UpdateCryptoWalletDto) {
    const crypto = await this.cryptoWalletService.findByIdAndUpdate(id, updateCryptoWalletDto);

    if (!crypto) {
      throw new NotFoundException('Wallet not found.');
    }
    const data = await this.cryptoWalletService.findOne({ _id: id });
    return { status: true, data: data, message: "Wallet updated successfully" };
  }

  async remove(id: any) {
    const crypto = await this.cryptoWalletService.findByIdAndDelete(id);

    if (!crypto) {
      throw new NotFoundException('Wallet not found.');
    }

    return { status: true, message: "Wallet Delete successfully" };
  }

  async findByCountryForMobile(ctry: string) {
    const getCountry = await this.cryptoWalletService.find({ country: { $in: [ctry] } });
     if(getCountry.length > 0){
        return {status:true,message:"Crypt Wallet for country",walletdata:getCountry};
     }else{
      return {status:false,message:"Crypto wallet not found."};
     }
  }
}

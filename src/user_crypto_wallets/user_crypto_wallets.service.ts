import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCryptoWalletDto } from './dto/create-user_crypto_wallet.dto';
import { UpdateUserCryptoWalletDto } from './dto/update-user_crypto_wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserCryptoWallet } from './schemas/user_crypto_wallet.schema';
import mongoose from 'mongoose';

@Injectable()
export class UserCryptoWalletsService {
  constructor(
    @InjectModel(UserCryptoWallet.name)
    private  userCryptoWalletService:mongoose.Model<UserCryptoWallet>
  ){}

  async create(createUserCryptoWalletDto: CreateUserCryptoWalletDto) {
    var res = await this.userCryptoWalletService.create(createUserCryptoWalletDto);
    return res;
  }
  async findByCountry(user_id , country){

  }
 async findAll() {
  return await this.userCryptoWalletService.find();
  }

  async findOne(id: any) {
    return await this.userCryptoWalletService.findOne({_id : id});
  }
  async findOneUser(user_id: any) {
  
    return await this.userCryptoWalletService.findOne({user_id : user_id});
  } 

 async update(id: any, updateUserCryptoWalletDto: UpdateUserCryptoWalletDto) {
  const crypto = await this.userCryptoWalletService.findByIdAndUpdate(id,updateUserCryptoWalletDto);

  if (!crypto) {
    throw new NotFoundException('Wallet not found.');
  }

  return {status: true,message: "Wallet updated successfully"};
  }

  async remove(id: any) {
    const crypto = await this.userCryptoWalletService.findByIdAndDelete(id);

    if (!crypto){
      throw new NotFoundException('Wallet not found.');
    }
  
    return {status: true,message: "Wallet Delete successfully"};
  }
}

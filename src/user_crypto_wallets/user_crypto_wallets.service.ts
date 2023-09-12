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
    private userCryptoWalletService: mongoose.Model<UserCryptoWallet>
  ) { }

  async create(createUserCryptoWalletDto: CreateUserCryptoWalletDto) {
    var res = await this.userCryptoWalletService.create(createUserCryptoWalletDto);
    return res;
  }
  async findByUser(user_id) {
    return await this.userCryptoWalletService.aggregate([
      {
        $match: {
          user_id: user_id, // Replace with the user_id you're looking for
        },
      },
      {
        $addFields: {
          hasSelectedBank: {
            $in: ["selected", "$wallet_detail.status"],
          },
        },
      },
      {
        $match: {
          hasSelectedBank: true,
        },
      },
    ]);

  }
  async findAll() {
    return await this.userCryptoWalletService.find();
  }

  async findOne(id: any) {
    return await this.userCryptoWalletService.findOne({ _id: id });
  }
  async findOneUser(user_id: any) {
 
    return await this.userCryptoWalletService.find({user_id : user_id});
  } 
 

    return await this.userCryptoWalletService.find({ user_id: user_id });
  }

  async update(id: any, updateUserCryptoWalletDto: UpdateUserCryptoWalletDto) {
    const crypto = await this.userCryptoWalletService.findByIdAndUpdate(id, updateUserCryptoWalletDto);

    if (!crypto) {
      throw new NotFoundException('Wallet not found.');
    }
    const wallet = await this.userCryptoWalletService.findOne({ _id: id });

    return { status: true, wallet: wallet, message: "updated" };
  }

  async remove(id: any) {
    const crypto = await this.userCryptoWalletService.findByIdAndDelete(id);

    if (!crypto) {
      throw new NotFoundException('Wallet not found.');
    }

    return { status: true, message: "removed" };
  }
}

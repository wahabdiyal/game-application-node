import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCryptoWalletDto } from './dto/create-user_crypto_wallet.dto';
import { UpdateUserCryptoWalletDto } from './dto/update-user_crypto_wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserCryptoWallet } from './schemas/user_crypto_wallet.schema';
import mongoose from 'mongoose';
import { UserBanksService } from 'src/user_banks/user_banks.service';
import { UserBank } from 'src/user_banks/schemas/user_banks.schema';

@Injectable()
export class UserCryptoWalletsService {
  constructor(
    @InjectModel(UserCryptoWallet.name)
    private userCryptoWalletService: mongoose.Model<UserCryptoWallet>,
    @InjectModel(UserBank.name)
    private userBankService: mongoose.Model<UserBank>,
  ) { }

  async create(createUserCryptoWalletDto: CreateUserCryptoWalletDto) {
    if (createUserCryptoWalletDto['is_selected'] === true) await this.clearSelectBankWallet(createUserCryptoWalletDto['user_id'].toString());
    var res = await this.userCryptoWalletService.create(createUserCryptoWalletDto);
    return res;
  }
  async findByUser(user_id) {
    return await this.userCryptoWalletService.aggregate([
      {
        $match: {
          user_id: user_id,
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
    return await this.userCryptoWalletService.find({ user_id: user_id }).sort({ createdAt: -1 }).exec();
  }

  async findOneUserSelected(user_id: any) {
    return await this.userCryptoWalletService.find({ user_id: user_id, is_selected: 1 }).sort({ createdAt: -1 }).exec();
  }



  async update(id: any, updateUserCryptoWalletDto: UpdateUserCryptoWalletDto) {
    if (updateUserCryptoWalletDto['is_selected'] === true) await this.clearSelectBankWallet(updateUserCryptoWalletDto['user_id'].toString());
    if (updateUserCryptoWalletDto['is_selected'] === 1) await this.clearSelectBankWallet(updateUserCryptoWalletDto['user_id'].toString());

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

    return { status: true, message: "Wallet removed" };
  }
  async clearSelectBankWallet(user_id: string) {
    await this.userCryptoWalletService.updateMany(
      { user_id: user_id },
      { $set: { is_selected: 0 } }
    );

    await this.userBankService.updateMany(
      { user_id: user_id },
      { $set: { is_selected: 0 } }
    );

  }
}

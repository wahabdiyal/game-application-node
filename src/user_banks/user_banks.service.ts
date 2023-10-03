import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserBankDto } from './dto/create-user_bank.dto';
import { UpdateUserBankDto } from './dto/update-user_bank.dto';
import { UserBank } from './schemas/user_banks.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserCryptoWallet } from 'src/user_crypto_wallets/schemas/user_crypto_wallet.schema';
import { UserCryptoWalletsService } from 'src/user_crypto_wallets/user_crypto_wallets.service';

@Injectable()
export class UserBanksService {
  constructor(
    @InjectModel(UserBank.name)
    private userBankService: mongoose.Model<UserBank>,
    @InjectModel(UserCryptoWallet.name)
    private userCryptoWalletService: mongoose.Model<UserCryptoWallet>,

    // private clearSelectedWalletBanksService: ClearSelectedWalletBanksService
  ) { }

  async create(createUserBankDto: CreateUserBankDto) {

    ///clear all selected wallet and banks
    if (createUserBankDto['is_selected'] === true) await this.clearSelectBankWallet(createUserBankDto['user_id'].toString());

    var res = await this.userBankService.create(createUserBankDto);
    return res;
  }

  async findByUser(user_id) {
    return await this.userBankService.aggregate([
      {
        $match: {
          user_id: user_id, // Replace with the user_id you're looking for
        },
      },
      {
        $addFields: {
          hasSelectedBank: {
            $in: ["selected", "$bank_detail.status"],
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
    return await this.userBankService.find();
  }

  async findOne(id: any) {
    return await this.userBankService.findOne({ _id: id });
  }

  async findOneUser(user_id: any) {
   return await this.userBankService.find({ user_id: user_id });
      }

  async update(id: any, updateUserBankDto: UpdateUserBankDto) {

    ///clear all selected wallet and banks
    if (updateUserBankDto['is_selected'] === true) await this.clearSelectBankWallet(updateUserBankDto['user_id'].toString());
    
    if (updateUserBankDto['is_selected'] == '1'){ await this.clearSelectBankWallet(updateUserBankDto['user_id'].toString());}

    const user_bank = await this.userBankService.findByIdAndUpdate(id, updateUserBankDto);

    if (!user_bank) {
      throw new NotFoundException('Bank not found');
    }
    const bank = await this.userBankService.findOne({ _id: id })

    return { status: true, bank: bank, message: "updated" };
  }

  async remove(id: any) {
    const user_bank = await this.userBankService.findByIdAndDelete(id);

    if (!user_bank) {
      throw new NotFoundException('not found');
    }

    return { status: true, message: "removed" };

  }
  async clearSelectBankWallet(user_id: string) {
    await this.userBankService.updateMany(
      { user_id: user_id },
      { $set: { is_selected: 0 } }
    );
    await this.userCryptoWalletService.updateMany(
      { user_id: user_id },
      { $set: { is_selected: 0 } }
    );

  }

}

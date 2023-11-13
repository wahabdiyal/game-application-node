import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRechargeAdminWalletDto } from './dto/create-recharge-admin-wallet.dto';
import { UpdateRechargeAdminWalletDto } from './dto/update-recharge-admin-wallet.dto';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RechargeAdminWallets } from './schemas/recharge-admin-wallets.schema';

@Injectable()
export class RechargeAdminWalletsService {
  constructor(
    @InjectModel(RechargeAdminWallets.name)
    private rechargeAdminWalletsModal: mongoose.Model<RechargeAdminWallets>
  ) { }

  async create(createRechargeAdminWalletDto: CreateRechargeAdminWalletDto) {
    var res = await this.rechargeAdminWalletsModal.create(createRechargeAdminWalletDto);
    return res;
  }

  async findAll() {
    return await this.rechargeAdminWalletsModal.find();
  }

  async findOne(id: string) {
    return await this.rechargeAdminWalletsModal.findOne({ _id: id });
  }
  async findOneByCountry(country: string) {
    return await this.rechargeAdminWalletsModal.findOne({ countries: { $in: [country] } });
  }


  async update(id: string, updateRechargeAdminWalletDto: UpdateRechargeAdminWalletDto) {
    const withdraw = await this.rechargeAdminWalletsModal.findByIdAndUpdate(id, updateRechargeAdminWalletDto);
    if (!withdraw) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "updated" };
  }

  async remove(id: string) {
    const withdraw = await this.rechargeAdminWalletsModal.findByIdAndDelete(id);

    if (!withdraw) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "removed" };
  }
}

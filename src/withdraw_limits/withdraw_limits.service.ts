import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWithdrawLimitDto } from './dto/create-withdraw_limit.dto';
import { UpdateWithdrawLimitDto } from './dto/update-withdraw_limit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Withdraw_limits } from './schmas/withdraw_limits.schema';
import mongoose from 'mongoose';

@Injectable()
export class WithdrawLimitsService {
  constructor(
    @InjectModel(Withdraw_limits.name)
    private Withdraw_limitsModel: mongoose.Model<Withdraw_limits>
  ) { }
  async create(createWithdrawLimitDto: CreateWithdrawLimitDto) {
    const countries = await this.Withdraw_limitsModel.findOne({ countries: { $in: createWithdrawLimitDto['countries'] } });
    if (countries) {
      return { status: false, message: "country is already exist in list." };
    }
    var res = await this.Withdraw_limitsModel.create(createWithdrawLimitDto);
    return res;
  }

  async findAll() {
    return await this.Withdraw_limitsModel.find();
  }

  async findOne(id: string) {
    return await this.Withdraw_limitsModel.findOne({ _id: id });
  }
  async findOneByCountry(country: string) {
    return await this.Withdraw_limitsModel.findOne({ countries: { $in: [country] } });
  }
  async findOneByCountryMobile(country: string) {
    const data = await this.Withdraw_limitsModel.findOne({ countries: { $in: [country] } });
    if (!data)
      return {
        status: false,
        message: "no record found",
        country: country,
        lowerlimiit: 0,
        uperlimit: 0,
        withdrawalpercentage: 0,
        description: ''
      }
    else
      return {
        status: true,
        message: "Withdrawal limit found for this country",
        country: country,
        lowerlimiit: data['min_gold_coin'],
        uperlimit: data['max_gold_coin'],
        withdrawalpercentage: data['percentage'],
        description: data['description']
      }
  }
  // Withdrawal limit 



  async update(id: string, updateWithdrawLimitDto: UpdateWithdrawLimitDto) {
    const withdraw = await this.Withdraw_limitsModel.findByIdAndUpdate(id, updateWithdrawLimitDto);
    if (!withdraw) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "updated" };
  }

  async remove(id: string) {
    const withdraw = await this.Withdraw_limitsModel.findByIdAndDelete(id);

    if (!withdraw) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "removed" };
  }
}

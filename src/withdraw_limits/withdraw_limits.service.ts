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
    var res = await this.Withdraw_limitsModel.create(createWithdrawLimitDto);
    return res;
  }

  async findAll() {
    return await this.Withdraw_limitsModel.find();
  }

  async findOne(id: string) {
    return await this.Withdraw_limitsModel.findOne({ _id: id });
  }

  async update(id: string, updateWithdrawLimitDto: UpdateWithdrawLimitDto) {
    const withdraw = await this.Withdraw_limitsModel.findByIdAndUpdate(id, updateWithdrawLimitDto);
    if (!withdraw) {
      throw new NotFoundException('Withdraw not found.');
    }

    return { status: true, message: "Withdraw updated successfully" };
  }

  async remove(id: string) {
    const withdraw = await this.Withdraw_limitsModel.findByIdAndDelete(id);

    if (!withdraw) {
      throw new NotFoundException('Withdraw not found.');
    }

    return { status: true, message: "Withdraw Delete successfully" };
  }
}

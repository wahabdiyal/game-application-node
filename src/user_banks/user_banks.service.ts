import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserBankDto } from './dto/create-user_bank.dto';
import { UpdateUserBankDto } from './dto/update-user_bank.dto';
import { UserBank } from './schemas/user_banks.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class UserBanksService {
  constructor(
    @InjectModel(UserBank.name)
    private userBankService: mongoose.Model<UserBank>,
  ) { }

  async create(createUserBankDto: CreateUserBankDto) {
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
    const user_bank = await this.userBankService.findByIdAndUpdate(id, updateUserBankDto);

    if (!user_bank) {
      throw new NotFoundException('not found');
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

}

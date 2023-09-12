import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminAccountDto } from './dto/create-admin_account.dto';
import { UpdateAdminAccountDto } from './dto/update-admin_account.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AdminAccount } from './schemas/admin_account.schema';

@Injectable()
export class AdminAccountsService {
  constructor(
    @InjectModel(AdminAccount.name)
    private accountService: mongoose.Model<AdminAccount>
  ){}
  async create(createAdminAccountDto: CreateAdminAccountDto) {
    // return {...createAdminAccountDto,"gold_coin_balance":Number(createAdminAccountDto['gold_coin_balance'])+Number(createAdminAccountDto['credit'])}
    var res = await this.accountService.create( createAdminAccountDto );
    return res;
  }

 async findAll() {
  return await this.accountService.find();
  }

 async findOne(id: any) {
    return await this.accountService.findOne({_id : id});
  }

  async update(id: any, updateAdminAccountDto: UpdateAdminAccountDto) {
    const account = await this.accountService.findByIdAndUpdate(id,updateAdminAccountDto);

    if (!account) {
      throw new NotFoundException('account not found.');
    }
  
    return {status: true,message: "account updated successfully"};
  }

  async remove(id: any) {
    const account = await this.accountService.findByIdAndDelete(id);

    if (!account){
      throw new NotFoundException('account not found.');
    }
  
    return {status: true,message: "account Delete successfully"};
  }
  async getLatestEntry(): Promise<any> {
    try {
      const latestRecord = await this.accountService
        .findOne()
        .sort({ createdAt: -1 }) 
        .exec();
      return latestRecord;
    } catch (error) {
      throw new Error(`Error finding the latest record: ${error.message}`);
    }
  }

}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminAccountDto } from './dto/create-admin_account.dto';
import { UpdateAdminAccountDto } from './dto/update-admin_account.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AdminAccount } from './schemas/admin_account.schema';
import { UserService } from 'src/user/user.service';
 

@Injectable()
export class AdminAccountsService {
  constructor(
    @InjectModel(AdminAccount.name)
    private acoountModel: mongoose.Model<AdminAccount>,
    private userService : UserService
  ){}
  async create(createAdminAccountDto: CreateAdminAccountDto) {
    const player = await this.userService.findUserbyId(createAdminAccountDto['user_id']);
     if(!player){
        return {status:false,message:"User is not found."};
     }

    const user = await this.userService.findByEmail(process.env.DF_EMAIL);
 
    if(user && user.email){
     
       
      let userbal:number =(createAdminAccountDto['credit']!="0") ? Number(user.gold_balance)+Number(createAdminAccountDto['credit']):Number(user.gold_balance) - Number(createAdminAccountDto['debit']);
       
      await this.userService.update(user.id,{gold_balance:userbal});

    var res = await this.acoountModel.create({
      ...createAdminAccountDto,
      gold_coin_balance:userbal,
      email:player.email 
    });
    return res;
    }
    return {status:false,message:"Admin mail not found"};
    }

 async findAll() {
  return await this.acoountModel.find();
  }

 async findOne(id: any) {
    return await this.acoountModel.findOne({_id : id});
  }

  async update(id: any, updateAdminAccountDto: UpdateAdminAccountDto) {
    const account = await this.acoountModel.findByIdAndUpdate(id,updateAdminAccountDto);

    if (!account) {
      throw new NotFoundException('account not found.');
    }
  
    return {status: true,message: "account updated successfully"};
  }

  async remove(id: any) {
    const account = await this.acoountModel.findByIdAndDelete(id);

    if (!account){
      throw new NotFoundException('account not found.');
    }
  
    return {status: true,message: "account Delete successfully"};
  }
  async getLatestEntry(): Promise<any> {
    try {
      const latestRecord = await this.acoountModel
        .findOne()
        .sort({ createdAt: -1 }) 
        .exec();
      return latestRecord;
    } catch (error) {
      throw new Error(`Error finding the latest record: ${error.message}`);
    }
  }

}

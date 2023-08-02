import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Withdraw } from './schmas/withdraw.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { GoldsService } from 'src/golds/golds.service';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectModel(Withdraw.name)
    private withDrawModel: mongoose.Model<Withdraw>,
    private userService: UserService,
    private goldService: GoldsService,
  ){}

   async create(createWithdrawDto: CreateWithdrawDto): Promise<any>  {
      const userCoin = await this.goldService.countOfUserCoin(createWithdrawDto['user_id']);
      if(userCoin['total'] <= 0) {
        return {status:false,'message':'Request not processed because user not have enough coins.'};
      }
      console.log(userCoin);
    var res = await this.withDrawModel.create(createWithdrawDto);
     return res;
  }

  async findAll():Promise<Withdraw[]> {
    return await this.withDrawModel.find();
  }

  async findOne(id: any): Promise<Withdraw> {
    return await this.withDrawModel.findOne({_id : id});
  }

  async update(id: any, updateWithdrawDto: UpdateWithdrawDto) {
    const withdraw = await this.withDrawModel.findByIdAndUpdate(id,updateWithdrawDto);

    if (!withdraw) {
      throw new NotFoundException('Withdraw not found.');
    }

    return {status: true,message: "Withdraw updated successfully"};
  }

  async remove(id: any) {
    const withdraw = await this.withDrawModel.findByIdAndDelete(id);

    if (!withdraw) {
      throw new NotFoundException('Withdraw not found.');
    }

    return {status: true,message: "Withdraw Delete successfully"};
  }

  async userRequest(id: any){
    const withdraw = await this.withDrawModel.find({client_id: id});

    if (withdraw.length==0) {
      throw new NotFoundException('Withdraw not found.');
    }
    return {status: true,message: "Withdraw User Request","Requests":withdraw};
  }

  async sumOfWithdraw(){
    const users  = await this.userService.findAll();
    const coinCounts = [];
    for (const user of users) {
    const withdraw = await this.withDrawModel.aggregate([
      {
        $match: {
            status:"approved",
            client_id: user.id,
            },
    },
    {
      $group:  {  _id: '$status',
                  totalCoin: { $sum: { $toInt: '$coins' } },
                },
    },
    
    ]);
    let totalCoin=0;
          if (withdraw.length > 0) {
            totalCoin = withdraw[0].totalCoin;
             
          }

    coinCounts.push({ user_id: user.id,
      //  coinCount,
       user_name : user.full_name,
       country:user.country,
       total_coin:totalCoin,
       

       });
  }
  return coinCounts;
  }

  async getRecordWithStatus(status: any){
    const withdraw = await this.withDrawModel.find({status: status});

    if (withdraw.length==0) {
      throw new NotFoundException('Withdraw not found.');
    }
    return {status: true,message:`Withdraw User ${status}`,"Requests":withdraw};
  }

}

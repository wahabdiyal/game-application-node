import { UserService } from './../user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoldDto } from './dto/create-gold.dto';
import { UpdateGoldDto } from './dto/update-gold.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Gold } from './schemas/gold_coin.schema';
import mongoose from 'mongoose';

@Injectable()
export class GoldsService { 
    constructor(
      @InjectModel(Gold.name)
      private goldModel: mongoose.Model<Gold>,
      private  userService : UserService,
      ){}

  async create(createGoldDto: CreateGoldDto) :Promise<any>  {
      
      if(!await this.userService.findUserbyId(createGoldDto['client_id'])){
          return {status: 'error', message:'User not found'};
      }
    var res = await this.goldModel.create(createGoldDto);
     return res; 
  }

  async findAll(): Promise<Gold[]> {
    const golds = await this.goldModel.find();
    return golds;
  }


  async findOne(id:any): Promise<Gold>{
    const gold = await this.goldModel.findById(id);
    return gold;
}

async update(id: any, body:UpdateGoldDto) {
  const gold = await this.goldModel.findByIdAndUpdate(id,body);

  if (!gold) {
    throw new NotFoundException('Gold Coin not found.');
  }

  return {status: true,message: "Gold Coin updated successfully"};
}

  async remove(id: any) {
    const gold = await this.goldModel.findByIdAndDelete(id);

    if (!gold) {
      throw new NotFoundException('Gold Coin  not found.');
    }

    return {status: true,message: "Gold Coin Delete successfully"};
  }
 
  async fetchAllCoinUserId(id: any) {
    const gold = await this.goldModel.find({client_id: id});

    if (gold.length==0) {
      throw new NotFoundException('Gold Coin not found.');
    }
    return {status: true,message: "Gold Coin User","coin":gold};
  }
    async fetchAllCoinCount(){
    let users = await this.userService.getAllUser();
    const coinCounts = [];
    for (const user of users) {
      // const coinCount = await this.goldModel.count({ client_id: user.id });
      const goldCredit = await this.goldModel.aggregate([
        {
          $match: {
            client_id: user.id,
            type: { $in: ['credit', 'debit'] },
          },
        },
        {
          $group: {
            _id: '$client_id',
            creditSum: { $sum: { $cond: [{ $eq: ['$type', 'credit'] }, { $toInt: '$coins' }, 0] } },
            debitSum: { $sum: { $cond: [{ $eq: ['$type', 'debit'] }, { $toInt: '$coins' }, 0] } },
          },
        },
        
      ]);
    
   let sumcredit=0; 
   let sumdebit=0;
      if (goldCredit.length > 0) {
        sumcredit = goldCredit[0].creditSum;
        sumdebit = goldCredit[0].debitSum;
         
      }
    //   const goldDebit = await this.goldModel.aggregate([
    //     {
    //       $match: {
    //         client_id: user.id,
    //         type: 'debit',
    //       },
    //     },
    //     {
    //       $group: {
    //         _id: '$client_id',
    //         totalDebit: { $sum: { $toInt: '$coins' } },
    //       },
    //     },
        
    //   ]);
    //   console.log(goldDebit);
     
    //  if (goldDebit.length > 0) {
    //   sumdebit = goldDebit[0].totalDebit;
    // }
     
      // for (const creditType of goldCredit){
      //     if(creditType.type == 'credit'){
      //     sumcredit = sumcredit + parseInt(creditType.coins);
      //   }else{
      //     sumdebit = sumdebit + parseInt(creditType.coins);
      //   }
      // }
      const goldcoin = await this.goldModel.findOne({ client_id: user.id }, { sort: { createdAt: -1 } }).select(
        "createdAt"
    );
      coinCounts.push({ user_id: user.id,
        //  coinCount,
         user_name : user.full_name,
         country:user.country,
         last_transation_date:goldcoin?.get('createdAt'),
         credit:sumcredit,
         debit:sumdebit

         });
    }
    return coinCounts;
  }
  async countOfUserCoin(user_id:any){
    const goldCredit = await this.goldModel.aggregate([
      {
        $match: {
          client_id: user_id,
          type: { $in: ['credit', 'debit'] },
        },
      },
      {
        $group: {
          _id: '$client_id',
          creditSum: { $sum: { $cond: [{ $eq: ['$type', 'credit'] }, { $toInt: '$coins' }, 0] } },
          debitSum: { $sum: { $cond: [{ $eq: ['$type', 'debit'] }, { $toInt: '$coins' }, 0] } },
        },
      },
      
    ]);
    let sumcredit:number=0; 
    let sumdebit:number=0;
       if (goldCredit.length > 0) {
         sumcredit = goldCredit[0].creditSum;
         sumdebit = goldCredit[0].debitSum;
          
       }
       return {total:sumcredit-sumdebit}
  }
}

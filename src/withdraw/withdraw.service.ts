import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Withdraw } from './schmas/withdraw.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
 

@Injectable()
export class WithdrawService {
  constructor(
    @InjectModel(Withdraw.name)
    private withDrawModel: mongoose.Model<Withdraw>,
    private userService: UserService,
 
  ){}

   async create(createWithdrawDto: CreateWithdrawDto): Promise<any>  {
      const userCoin = await this.userService.findUserbyId(createWithdrawDto['client_id']);
     
      if(Number(userCoin['gold_balance']) <= 0) {
        return {status:false,'message':'Request not processed because user not have enough coins.'};
      }
      
      await this.userService.update({ _id:userCoin['id']},{gold_balance:Number(userCoin['gold_balance'])- Number(createWithdrawDto['coins'])});

    var res = await this.withDrawModel.create(createWithdrawDto);
     return res;
  }
 
  async findAll( page = 0, perPage = 20,date = []) {
    let totalCount =0
     if(date.length > 0){
       
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
      
        totalCount =  await this.withDrawModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).countDocuments().exec();
      }else{
        totalCount = await this.withDrawModel.find().countDocuments().exec();
      }
       
      const totalPages = Math.ceil(totalCount / perPage);
      
      if (page < 1) {
        page = 1;
      } else if (page > totalPages) {
        page = totalPages;
      }
  
      const skip = (page - 1) * perPage;

      let data=[];
      try{
     
         if(date.length > 0){
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.withDrawModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).skip(skip).limit(perPage).exec();

      } else{
        data = await this.withDrawModel.find().skip(skip).limit(perPage).exec();
      }
    }catch(error){
     date = [];
    }
      return {
        data:data,
        currentPage: page,
        totalPages,
        perPage,
        total_count:totalCount,
      };
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
    const withdraw = await this.withDrawModel.find();

    if (withdraw.length==0) {
      throw new NotFoundException('Withdraw not found.');
    }
    return {status: true,message: "Withdraw User Request","Requests":withdraw};
  }

  async sumOfWithdraw(skip=0,limit=20):Promise<any> {
     const users = await this.userService.findAll(skip, limit);
     
    const coinCounts = [];
    for (const user of users['data']) {
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

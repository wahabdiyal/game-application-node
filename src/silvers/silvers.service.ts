import { UserService } from 'src/user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSilverDto } from './dto/create-silver.dto';
import { UpdateSilverDto } from './dto/update-silver.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Silver } from './schemas/silver_coin.schema';
 
 

@Injectable()
export class SilversService {
  constructor(
    @InjectModel(Silver.name)
    private silverModel: mongoose.Model<Silver>,
     private usersService: UserService,
     
     
    ){}

    async getuserbycoinId(id:any){
      return this.usersService.findwithUserId(id);
    }
 
    async  create(createCoinDto: CreateSilverDto): Promise<any>  {
      if(!await this.usersService.findUserbyId(createCoinDto['client_id'])){
        return {status: 'error', message:'User not found'};
    }
      var res = await this.silverModel.create(createCoinDto);
       return res;
      
      }

 async findAll(): Promise<Silver[]> {
    const silvers = await this.silverModel.find();
    return silvers;
  }

  async findOne(id:string): Promise<Silver>{
        const silver = await this.silverModel.findById(id);
        return silver;
  }

  async update(id: any, body:UpdateSilverDto) {
    const silver = await this.silverModel.findByIdAndUpdate(id,body);

    if (!silver) {
      throw new NotFoundException('Silver Coin  not found.');
    }

    return {status: true,message: "Silver Coin updated successfully"};
  }


  async remove(id: any) {
    const silver = await this.silverModel.findByIdAndDelete(id);

    if (!silver) {
      throw new NotFoundException('Silver Coin  not found.');
    }

    return {status: true,message: "Silver Coin Delete successfully"};
  }
      async findUserValue(id:any){
        return  await this.silverModel.find(id);
      }

      async fetchAllCoinUserId(id: any) {
        const silver = await this.silverModel.find({client_id: id});
    
        if (silver.length==0) {
          throw new NotFoundException('Silver Coin not found.');
        }
        return {status: true,message: "silver Coin User","coin":silver};
      }

      async fetchAllCoinCount(){
        let users = await this.usersService.getAllUser();
        const coinCounts = [];
        for (const user of users) {
          // const coinCount = await this.goldModel.count({ client_id: user.id });
          const goldCredit = await this.silverModel.aggregate([
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
 
          const silvercoin = await this.silverModel.findOne({ client_id: user.id }, { sort: { createdAt: -1 } }).select(
            "createdAt"
        );
          coinCounts.push({ user_id: user.id,
            //  coinCount,
             user_name : user.full_name,
             country:user.country,
             last_transation_date:silvercoin?.get('createdAt'),
             credit:sumcredit,
             debit:sumdebit
    
             });
        }
        return coinCounts;
      }
}

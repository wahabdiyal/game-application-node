import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Withdraw } from './schmas/withdraw.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { AdminAccountsService } from 'src/admin_accounts/admin_accounts.service';
import { GoldsService } from 'src/golds/golds.service';
import { WithdrawLimitsService } from 'src/withdraw_limits/withdraw_limits.service';


@Injectable()
export class WithdrawService {
  constructor(
    @InjectModel(Withdraw.name)
    private withDrawModel: mongoose.Model<Withdraw>,
    private userService: UserService,
    private goldService: GoldsService,
    private adminAccount: AdminAccountsService,
    private readonly withdrawlimitService:WithdrawLimitsService

  ) { }

  async create(createWithdrawDto: CreateWithdrawDto): Promise<any> {
    const userCoin = await this.userService.findUserbyId(createWithdrawDto['client_id']);
     
    if (!userCoin) {
      return new NotFoundException("User not found");
    }
    ///////condition add here check for balance 
    if (Number(userCoin['gold_balance']) <= 0 || Number(userCoin['gold_balance']) < Number(createWithdrawDto['coins']))
      return { status: false, 'message': 'not enough coins.' };


    await this.goldService.create({
      client_id:createWithdrawDto['client_id'],
      remarks: "Coin is debit withdrawl",
      type:"debit",
      coins:createWithdrawDto['coins']
     });

    await this.userService.update({ _id: userCoin['id'] }, { gold_balance: Number(userCoin['gold_balance']) - Number(createWithdrawDto['coins']) });

    if (createWithdrawDto['status'] == "approved") {
      const latestAdminBal = await this.adminAccount.getLatestEntry();

      await this.adminAccount.create({ 
        remarks: "Added gold balance from withdrawal", 
        credit: Number(createWithdrawDto['coins']), 
        client_id: createWithdrawDto['client_id'], 
        gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) + Number(createWithdrawDto['coins']) });
    }
    var res = await this.withDrawModel.create(createWithdrawDto);
    return res;
  }

  ///////////mobile///////////////

  async getLimitWithdraw(country:string){
    const valueWithdrawLimit = await this.withdrawlimitService.findOneByCountry(country);
    return valueWithdrawLimit;
  }

  async createWithdrawRequest(createWithdrawDto: CreateWithdrawDto): Promise<any> {
    const userCoin = await this.userService.findUserbyId(createWithdrawDto['client_id']);
     
    if (!userCoin) {
      return new NotFoundException("User not found");
    }
    ///////condition add here check for balance 
    if (Number(userCoin['gold_balance']) <= 0) {
      return { status: false, 'message': 'Request not processed because user not have enough coins.' };
    }

    await this.goldService.create({
      client_id:createWithdrawDto['client_id'],
      remarks: "Coin is debit withdrawl",
      type:"debit",
      coins:createWithdrawDto['coins']
     });

    await this.userService.update({ _id: userCoin['id'] }, { gold_balance: Number(userCoin['gold_balance']) - Number(createWithdrawDto['coins']) });


    var res = await this.withDrawModel.create(createWithdrawDto);
    return res;
  }

  async findAll(page = 0, perPage = 20, date = [], status = false) {
    let totalCount = 0
    if (date.length > 0 && status) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.withDrawModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        status: status
      }).countDocuments().exec();
    } else if (date.length > 0) {

      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.withDrawModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();
    } else if (status) {
      totalCount = await this.withDrawModel.find({
        status: status,
      }).countDocuments().exec();
    } else {
      totalCount = await this.withDrawModel.find().countDocuments().exec();
    }

    const totalPages = Math.ceil(totalCount / perPage);

    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * perPage;

    let data = [];
    try {

      if (date.length > 0 && status) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.withDrawModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          status: status
        }).populate('client_id').skip(skip).limit(perPage).exec();
      } else if (status) {
        data = await this.withDrawModel.find({
          status: status
        }).populate('client_id').skip(skip).limit(perPage).exec();
      }
      else if (date.length > 0) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.withDrawModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).populate('client_id').skip(skip).limit(perPage).exec();

      } else {
        data = await this.withDrawModel.find().skip(skip).limit(perPage).exec();
      }
    } catch (error) {
      date = [];
    }
    return {
      data: data,
      currentPage: page,
      totalPages,
      perPage,
      total_count: totalCount,
    };
  }

  async findOne(id: any): Promise<Withdraw> {
    return await this.withDrawModel.findOne({ _id: id });
  }

  // async update(id: any, updateWithdrawDto: UpdateWithdrawDto) {
  //   const previous = await this.withDrawModel.findOne({ _id: id });
  //   const userCoin = await this.userService.findUserbyId(previous['client_id'].toString());

  //   ///update entity
  //   await this.withDrawModel.findByIdAndUpdate(id, updateWithdrawDto);

  //   let latestAdminBal:any = await this.adminAccount.getLatestEntry();
  //   if ((previous.status as string) == "approved") {
  //     if (updateWithdrawDto['status'] == "canceled") {
  //       await this.adminAccount.create({
  //         remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
  //         credit: 0,
  //         debit: Number(previous['coins']),
  //         user_id: previous['client_id'],
  //         gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) - Number(previous['coins'])
  //       });
  //       await this.userService.update({ _id: previous['client_id'].toString() }, { gold_balance: Number(userCoin['gold_balance']) + Number(previous['coins']) });
  //     }
  //     if (updateWithdrawDto['status'] == "inprocessed" || updateWithdrawDto['status'] == "pending") {
  //       await this.adminAccount.create({
  //         remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
  //         credit: 0,
  //         debit: Number(previous['coins']),
  //         user_id: previous['client_id'],
  //         gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) - Number(previous['coins'])
  //       });
  //     }




  //   }
  //   else if ((previous.status as string) == "canceled") {
  //     if (updateWithdrawDto['status'] == "approved") {
  //       await this.adminAccount.create({
  //         remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
  //         credit: Number(previous['coins']),
  //         debit: 0,
  //         user_id: previous['client_id'],
  //         gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) + Number(previous['coins'])
  //       });
  //       await this.userService.update({ _id: previous['client_id'].toString() }, { gold_balance: Number(userCoin['gold_balance']) - Number(previous['coins']) });
  //     }
  //     if (updateWithdrawDto['status'] == "inprocessed" || updateWithdrawDto['status'] == "pending") {
  //       await this.userService.update({ _id: previous['client_id'].toString() }, { gold_balance: Number(userCoin['gold_balance']) - Number(previous['coins']) });
  //     }
  //   }

  //   else {
  //     if (updateWithdrawDto['status'] == "approved") {
  //       await this.adminAccount.create({
  //         remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
  //         credit: Number(previous['coins']),
  //         debit: 0,
  //         user_id: previous['client_id'],
  //         gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) + Number(previous['coins'])
  //       });
  //     }
  //     if (updateWithdrawDto['status'] == "canceled") {
  //       await this.userService.update({ _id: previous['client_id'].toString() }, { gold_balance: Number(userCoin['gold_balance']) + Number(previous['coins']) });
  //     }
  //   } ///pending//inprogress




  //   const latestAdminBal = await this.adminAccount.getLatestEntry();
  //   const withdrow = await this.findOne(id);
    
  //   if (withdrow && withdrow['status'] == "approved" && withdraw['proved_date']==null){
      
  //     const commission = Math.ceil((Number(withdrow.admin_commission) /100)*Number(withdrow['coins']));
  //     await this.adminAccount.create({ 
  //       remarks: "Added gold balance from withdrawal", 
  //       type:"commission_withdraw",
  //       "debit":"0",
  //       credit: Number(commission), 
  //       user_id: withdrow['client_id'], 
  //         });
  //         await this.withDrawModel.findByIdAndUpdate(id, {proved_date: new Date().toISOString()});
  //    //////////// we need to cut coin when we are create withdraw request //////////////////////

  //     //    await this.goldService.create({
  //     //   client_id:withdrow['client_id'],
  //     //   remarks: "Coin is debit withdrawl",
  //     //   type:"debit",
  //     //   coins:withdrow['coins']
  //     //  });
       
  //     }else if(withdrow && updateWithdrawDto['status']=='cancel'){
  //       const commission = Math.ceil((Number(withdrow.admin_commission) /100)*Number(withdrow['coins']));
  //     // await this.adminAccount.create({ 
  //     //   remarks: "Added gold balance from withdrawal", 
  //     //   type:"commission_withdraw",
  //     //   "debit":Number(commission),
  //     //   credit:"0" , 
  //     //   user_id: withdrow['client_id'], 
  //     //     });
  //        await this.goldService.create({
  //       client_id:withdrow['client_id'],
  //       remarks: "Coin is debit withdrawl",
  //       type:"credit",
  //       coins:withdrow['coins']
  //      }); 
  //     }
  //   return { status: true, message: "Withdraw updated successfully" };
  // }
  async update(id: any, updateWithdrawDto: UpdateWithdrawDto) {
    const previous = await this.withDrawModel.findOne({ _id: id });
    const userCoin = await this.userService.findUserbyId(previous['client_id'].toString());

    ///update entity
    await this.withDrawModel.findByIdAndUpdate(id, updateWithdrawDto);

    const latestAdminBal = await this.adminAccount.getLatestEntry();
    if ((previous.status as string) == "approved") {
      if (updateWithdrawDto['status'] == "canceled") {
        await this.adminAccount.create({
          remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
          credit: 0,
          debit: Number(previous['coins']),
          user_id: previous['client_id'],
          gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) - Number(previous['coins'])
        });
        await this.userService.update({ _id: previous['client_id'].toString() }, { gold_balance: Number(userCoin['gold_balance']) + Number(previous['coins']) });
      }
      if (updateWithdrawDto['status'] == "inprocessed" || updateWithdrawDto['status'] == "pending") {
        await this.adminAccount.create({
          remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
          credit: 0,
          debit: Number(previous['coins']),
          user_id: previous['client_id'],
          gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) - Number(previous['coins'])
        });
      }




    }
    else if ((previous.status as string) == "canceled") {
      if (updateWithdrawDto['status'] == "approved") {
        await this.adminAccount.create({
          remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
          credit: Number(previous['coins']),
          debit: 0,
          user_id: previous['client_id'],
          gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) + Number(previous['coins'])
        });
        await this.userService.update({ _id: previous['client_id'].toString() }, { gold_balance: Number(userCoin['gold_balance']) - Number(previous['coins']) });
      }
      if (updateWithdrawDto['status'] == "inprocessed" || updateWithdrawDto['status'] == "pending") {
        await this.userService.update({ _id: previous['client_id'].toString() }, { gold_balance: Number(userCoin['gold_balance']) - Number(previous['coins']) });
      }
    }

    else {
      if (updateWithdrawDto['status'] == "approved") {
        await this.adminAccount.create({
          remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
          credit: Number(previous['coins']),
          debit: 0,
          user_id: previous['client_id'],
          gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) + Number(previous['coins'])
        });
      }
      if (updateWithdrawDto['status'] == "canceled") {
        await this.userService.update({ _id: previous['client_id'].toString() }, { gold_balance: Number(userCoin['gold_balance']) + Number(previous['coins']) });
      }
    } ///pending//inprogress

    return { status: true, message: "Withdraw updated successfully" };
  }
  async remove(id: any) {
    const withdraw = await this.withDrawModel.findByIdAndDelete(id);

    if (!withdraw) {
      throw new NotFoundException('Withdraw not found.');
    }

    return { status: true, message: "Withdraw Delete successfully" };
  }

  async userRequest(id: any) {
    const withdraw = await this.withDrawModel.find();

    if (withdraw.length == 0) {
      throw new NotFoundException('Withdraw not found.');
    }
    return { status: true, message: "Withdraw User Request", "Requests": withdraw };
  }

  async sumOfWithdraw(skip = 0, limit = 20): Promise<any> {
    const users = await this.userService.findAll(skip, limit);

    const coinCounts = [];
    for (const user of users['data']) {
      const withdraw = await this.withDrawModel.aggregate([
        {
          $match: {
            status: "approved",
            client_id: user.id,
          },
        },
        {
          $group: {
            _id: '$status',
            totalCoin: { $sum: { $toInt: '$coins' } },
          },
        },

      ]);
      let totalCoin = 0;
      if (withdraw.length > 0) {
        totalCoin = withdraw[0].totalCoin;

      }

      coinCounts.push({
        user_id: user.id,
        //  coinCount,
        user_name: user.full_name,
        country: user.country,
        total_coin: totalCoin,


      });
    }
    return coinCounts;
  }

  async getRecordWithStatus(status: any) {
    const withdraw = await this.withDrawModel.find({ status: status });

    if (withdraw.length == 0) {
      throw new NotFoundException('Withdraw not found.');
    }
    return { status: true, message: `Withdraw User ${status}`, "Requests": withdraw };
  }

}

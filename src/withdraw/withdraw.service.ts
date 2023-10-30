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
import * as admin from 'firebase-admin';
import firebase from 'firebase/app'

@Injectable()
export class WithdrawService {
  private firestore: FirebaseFirestore.Firestore;
  constructor(
    @InjectModel(Withdraw.name)
    private withDrawModel: mongoose.Model<Withdraw>,
    private userService: UserService,
    private goldService: GoldsService,
    private adminAccount: AdminAccountsService,
    private readonly withdrawlimitService: WithdrawLimitsService

  ) {
    this.firestore = admin.firestore();
  }

  async create(createWithdrawDto: CreateWithdrawDto): Promise<any> {

    const userCoin = await this.userService.findUserbyId(createWithdrawDto['client_id']);

    if (!userCoin) {
      return new NotFoundException("User not found");
    }

    // const notificationDevice = await this.userService.findByEmail(process.env.DF_EMAIL);
    // await admin.messaging().send({
    //   notification: { title: "withdraw", body: "Withdraw requested" },
    //   webpush: {
    //     headers: {
    //       Urgency: "high", // Set high priority for web
    //     },
    //   },
    //   token: notificationDevice.deviceToken,//"d1asJgYt-MecbukBo_UOeJ:APA91bGFJAc6BgGcWWubjUa4WdrV6t1J0gDIDvrCos-nA0FzajoSbiQcM_tdAHD3MHJ-NReWzlnZ0bmr45s9a3jhps_rJmO9a0TnVZeWJ88zmllt7GI4Ouk18NAzq672-xR4E6KnrNX5", // Use the registration token of the web browser
    // });

    ///////condition add here check for balance 
    if (Number(userCoin['gold_balance']) <= 0 || Number(userCoin['gold_balance']) < Number(createWithdrawDto['coins']))
      return { status: false, 'message': 'not enough coins.' };


    await this.goldService.create({
      client_id: createWithdrawDto['client_id'],
      remarks: "Coin is debit withdrawl",
      type: "debit",
      coins: createWithdrawDto['coins']
    });

    await this.userService.update({ _id: userCoin['id'] }, { gold_balance: Number(userCoin['gold_balance']) - Number(createWithdrawDto['coins']) });

    if (createWithdrawDto['status'] == "approved") {
      const latestAdminBal = await this.adminAccount.getLatestEntry();

      await this.adminAccount.create({
        remarks: "Added gold balance from withdrawal",
        credit: Number(createWithdrawDto['coins']),
        client_id: createWithdrawDto['client_id'],
        gold_coin_balance: (Number(latestAdminBal?.gold_coin_balance) ? Number(latestAdminBal?.gold_coin_balance) : 0) + Number(createWithdrawDto['coins'])
      });
    }
    createWithdrawDto['client_country'] = userCoin.country;
    createWithdrawDto['client_first_name'] = userCoin.first_name;
    createWithdrawDto['client_last_name'] = userCoin.last_name;
    createWithdrawDto['client_userId'] = userCoin.userId;
    var res = await this.withDrawModel.create({ ...createWithdrawDto, transaction_id: Math.random().toString(36).slice(-5) });
    return res;
  }

  ///////////mobile///////////////

  async getLimitWithdraw(country: string) {
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
      client_id: createWithdrawDto['client_id'],
      remarks: "Coin is debit withdrawl",
      type: "debit",
      coins: createWithdrawDto['coins']
    });

    await this.userService.update({ _id: userCoin['id'] }, { gold_balance: Number(userCoin['gold_balance']) - Number(createWithdrawDto['coins']) });


    var res = await this.withDrawModel.create(createWithdrawDto);
    return res;
  }

  async findAll(page = 0, perPage = 20, date = [], status = false, search = false) {


    let totalCount = 0
    if (date.length > 0 && status && search) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.withDrawModel.find({
        $or: [
          { transaction_id: { $regex: search, $options: 'i' } },
          { payment_id: { $regex: search, $options: 'i' } },
          { client_id: { $regex: search, $options: 'i' } },
        ],
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        status: status
      }).countDocuments().exec();
    } else if (date.length > 0 && search) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.withDrawModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        $or: [
          { transaction_id: { $regex: search, $options: 'i' } },
          { payment_id: { $regex: search, $options: 'i' } },
          { client_id: { $regex: search, $options: 'i' } },
        ],
      }).countDocuments().exec();
    } else if (date.length > 0 && status) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.withDrawModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        status: status
      }).countDocuments().exec();
    } else if (search && status) {

      totalCount = await this.withDrawModel.find({
        $or: [
          { client_country: { $regex: search, $options: 'i' } },
          { client_first_name: { $regex: search, $options: 'i' } },
          { client_last_name: { $regex: search, $options: 'i' } },
          { client_userId: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
          { payment_id: { $regex: search, $options: 'i' } },
        ],
        status: status
      }).countDocuments().exec();
    } else if (search) {
      totalCount = await this.withDrawModel.find({
        $or: [
          { client_country: { $regex: search, $options: 'i' } },
          { client_first_name: { $regex: search, $options: 'i' } },
          { client_last_name: { $regex: search, $options: 'i' } },
          { client_userId: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
          { payment_id: { $regex: search, $options: 'i' } },
        ],
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
      if (date.length > 0 && status && search) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.withDrawModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          status: status,
          $or: [
            { client_country: { $regex: search, $options: 'i' } },
            { client_first_name: { $regex: search, $options: 'i' } },
            { client_last_name: { $regex: search, $options: 'i' } },
            { client_userId: { $regex: search, $options: 'i' } },
            { transaction_id: { $regex: search, $options: 'i' } },
            { payment_id: { $regex: search, $options: 'i' } },
          ],
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (date.length > 0 && status) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.withDrawModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          status: status
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (date.length > 0 && search) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.withDrawModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          $or: [
            { client_country: { $regex: search, $options: 'i' } },
            { client_first_name: { $regex: search, $options: 'i' } },
            { client_last_name: { $regex: search, $options: 'i' } },
            { client_userId: { $regex: search, $options: 'i' } },
            { transaction_id: { $regex: search, $options: 'i' } },
            { payment_id: { $regex: search, $options: 'i' } },
          ],
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (search && status) {
        data = await this.withDrawModel.find({
          $or: [
            { client_country: { $regex: search, $options: 'i' } },
            { client_first_name: { $regex: search, $options: 'i' } },
            { client_last_name: { $regex: search, $options: 'i' } },
            { client_userId: { $regex: search, $options: 'i' } },
            { transaction_id: { $regex: search, $options: 'i' } },
            { payment_id: { $regex: search, $options: 'i' } },
          ],
          status: status
        })
          .sort({ createdAt: -1 }).skip(skip).limit(perPage)
          .exec();
        console.log(search)
      } else if (search) {
        data = await this.withDrawModel.find({
          $or: [
            { client_country: { $regex: search, $options: 'i' } },
            { client_first_name: { $regex: search, $options: 'i' } },
            { client_last_name: { $regex: search, $options: 'i' } },
            { client_userId: { $regex: search, $options: 'i' } },
            { transaction_id: { $regex: search, $options: 'i' } },
            { payment_id: { $regex: search, $options: 'i' } },
          ],
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (status) {
        data = await this.withDrawModel.find({
          status: status
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (date.length > 0) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.withDrawModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

      } else {
        data = await this.withDrawModel.find().sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
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
    const player = await this.userService.findByID(previous['client_id'].toString());
    const userCoin = await this.userService.findUserbyId(previous['client_id'].toString());

    ///update entity
    await this.withDrawModel.findByIdAndUpdate(id, updateWithdrawDto);

    const latestAdminBal = await this.adminAccount.getLatestEntry();
    if ((previous.status as string) == "approved") {
      if (updateWithdrawDto['status'] == "canceled") {
        await this.adminAccount.create({
          remarks: "withdrawal: " + previous.status + " to " + updateWithdrawDto['status'] + ", TrD:" + previous._id,
          credit: 0,
          country: player.country,
          type: "commission_withdraw",
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
          country: player.country,
          type: "commission_withdraw",
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
          country: player.country,
          type: "commission_withdraw",
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
          country: player.country,
          type: "commission_withdraw",
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
    const withdraw = await this.withDrawModel.find({ client_id: id });

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
  async history(page = 1, perPage = 20, _id: string) {
    try {
      let query: any = {
        client_id: _id,
      };

      ///////////////////////////////////////////////////////////////////// counter search
      let totalCount = 0
      totalCount = await this.withDrawModel.find(query).countDocuments().exec();
      const totalPages = Math.ceil(totalCount / perPage);
      let message = "not history found"


      if (page < 1) {
        page = 1;
      } else if (page > totalPages) {
        page = totalPages;
      }

      const skip = (page - 1) * perPage;
      ///////////////////////////////////////////////////////////////////// counter search

      const data = await this.withDrawModel
        .find(query)
        // .select('transaction_id coins status withdraw_amount total_amount createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .exec();



      const modifiedData = data.map((item: any) => ({
        ...item,
        status: item.status = 'approved' ? 'approved'
          : item.status = 'canceled' ? "disapproved" : 'awaiting',
      }));


      if (data.length > 0) message = "withdraw history found"
      return {
        status: true,
        message: message,
        gamehistory: modifiedData,
        currentPage: page,
        totalPages,
        perPage,
        total_count: totalCount,
      };
    } catch (error) {

      return {
        status: true,
        message: "not history found",
        gamehistory: [],
        currentPage: page,
        totalPages: 1,
        perPage,
        total_count: 1,
      };
    }

  }



}

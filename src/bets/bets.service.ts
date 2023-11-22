import { NotificationService } from './../gerenal-notification/notification.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bets } from './schemas/bets.schema';
import mongoose from 'mongoose';
import * as moment from "moment";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule/dist';
import { OnEvent } from '@nestjs/event-emitter/dist/decorators';
import { UserService } from 'src/user/user.service';
import { GamesService } from 'src/games/games.service';
import { AdminAccountsService } from 'src/admin_accounts/admin_accounts.service';
import { GoldsService } from 'src/golds/golds.service';
import { SilversService } from 'src/silvers/silvers.service';
 

@Injectable()
export class BetsService {
  constructor(
    @InjectModel(Bets.name)
    private betsModel: mongoose.Model<Bets>,
    private userService: UserService,
    private gameService: GamesService,
    private adminAcountService: AdminAccountsService,
    private goldService: GoldsService,
    private silverService: SilversService,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService
  ) { }
  async create(createbetDto: CreateBetDto) {

    var transactionId = Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1);
    
    const checkBetId = await this.betsModel.findOne({transaction_id:transactionId});
    if(checkBetId){
      var transactionId = Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1)+ Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1);
    }
 
    const first_user = await this.userService.findUserbyId(createbetDto['first_player']);
    const today = new Date();
    const userBet = await this.betsModel.find({
      first_player: createbetDto['first_player'],
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    }).countDocuments().exec();

    const game = await this.gameService.findbyId(createbetDto['game_id']);
    if (game && Number(game.maximum_challenges) < userBet && createbetDto['second_player'] != "ai") {
      return { status: false, message: "Challenges exceeded" };
    }

    //     if(createbetDto['second_player'] === "hacked"){
    //     if ( Number(first_user['silver_balance']) > Number(createbetDto['silver']) && createbetDto['second_player'] === "hacked") {


    if (!game) {
      return { status: false, message: "Game not found" };
    }
    createbetDto['game_id'] = game._id;
    if (createbetDto['second_player'] === "ai") {
      if (Number(first_user['silver_balance']) > Number(createbetDto['silver']) && createbetDto['second_player'] === "ai") {

        await this.userService.UpdateUser(first_user['_id'], Number(first_user['silver_balance']) - Number(createbetDto['silver']), 'silver');
        const res = await this.betsModel.create({
          status:"inactive",
          first_player:createbetDto['first_player'],
          game_id:createbetDto["game_id"],
          silver:createbetDto["silver"],
          remark:createbetDto["remark"],
          first_email: first_user['email'],
          first_name: first_user['first_name'],
          last_name: first_user['last_name'],
          first_user_id: first_user['userId'],
          first_user_country: first_user['country'],
          transaction_id: transactionId,
        });
        return { ...await this.userService.fetchUserProfile(first_user['email']), bet: res, game: game };
      }
      else {
        return { status: false, message: "Coin is not enough to play." }
      }

    }
    /////////////////////////silver coin//////////////////////
    if (Number(first_user['silver_balance']) > Number(createbetDto['silver']) && Number(createbetDto['silver']) != 0) {
      if (!first_user['bet_block'].includes(game.game_id)) {
        await this.userService.UpdateUser(first_user['_id'], Number(first_user['silver_balance']) - Number(createbetDto['silver']), 'silver');
        const res = await this.betsModel.create({
          status:"inactive",
          first_player:createbetDto['first_player'],
          game_id:createbetDto["game_id"],
          silver:createbetDto["silver"],
          remark:createbetDto["remark"],
          first_email: first_user['email'],
          first_name: first_user['first_name'],
          last_name: first_user['last_name'],
          first_user_id: first_user['userId'],
          first_user_country: first_user['country'],
          transaction_id: transactionId,
          createdAt:new Date().toISOString()
        });

        return { ...await this.userService.fetchUserProfile(first_user['email']), bet: res, game: game };
      } else {
        return { status: false, message: "User is blocked for this game." }
      }
    }
    ////// gold/////////////
    else if (Number(first_user['gold_balance']) > Number(createbetDto['gold']) && Number(createbetDto['gold']) != 0) {
      if (!first_user['bet_block'].includes(game.game_id)) {


        /////playing with gold /////
        await this.userService.UpdateUser(first_user['_id'], Number(first_user['gold_balance']) - Number(createbetDto['gold']), 'gold');
        const res = await this.betsModel.create({
          status:"inactive",
          first_player:createbetDto['first_player'],
          game_id:createbetDto["game_id"],
          gold:createbetDto["gold"],
          remark:createbetDto["remark"],
          first_email: first_user['email'],
          first_name: first_user['first_name'],
          last_name: first_user['last_name'],
          first_user_id: first_user['userId'],
          first_user_country: first_user['country'],
          transaction_id: transactionId
        });
        return { ...await this.userService.fetchUserProfile(first_user['email']), bet: res, game: game };
      } else {
        return { status: false, message: "User is blocked for this game." }
      }
    }
    else {
      return { status: false, message: "user low balance" };
    }
  }
  async findOne(id: any) {
    return await this.betsModel.findOne({ _id: id });
  }
  async update(id: any, updatebetDto: UpdateBetDto) {
    const bet = await this.betsModel.findByIdAndUpdate(id, updatebetDto);

    if (!bet) {
      throw new NotFoundException('bet not found.');
    }

    const object = await this.betsModel.findOne(bet._id);

    return { status: true, data: object, message: "bet updated successfully" };
  }

  async remove(id: any) {
    const bet = await this.betsModel.findByIdAndDelete(id);

    if (!bet) {
      throw new NotFoundException('bet not found.');
    }

    return { status: true, message: "bet Delete successfully" };
  }

  /////actual function to update win & loss
  async betUpdateLoseWin(id: string, status: boolean) {
    const bet = await this.betsModel.findById(id);
    if (bet && bet.status != "complete") {
      const user = await this.userService.findUserbyId(bet.first_player);
      await this.update(id, { status: "complete" });
      if (status) {
        await this.silverService.create({
          client_id: bet.first_player,
          remarks: "ai silver win game TrD:" + bet['_id'],
          type: "credit",
          game_id: bet.game_id,
          coins: Number(user['silver_balance']) + Number(bet['silver']) + Number(bet['silver'])
        });
        return await this.userService.updateMobile(user['id'], { updated_by: "" });
        // return  await this.userService.updateMobile(user['id'],{silver_balance:Number(user['silver_balance'])+Number(bet['silver'])+Number(bet['silver'])});
      }
      ////////only for ai
      await this.silverService.create({
        client_id: user['_id'],
        "remarks": "ai silver loss game TrD:" + bet['_id'],
        "type": "debit",
        'game_id': bet.game_id,
        "coins": 0
      });
      return await this.userService.updateMobile(user['id'], { silver_balance: Number(user['silver_balance']) });

    } else {
      return { status: false, message: "Already request proccessed" };
    }
  }

  async betUpdateWinUser(id: string, user_id: string) {
    const bet = await this.betsModel.findById(id);
    if (bet && bet.status == "active") {
      const user = await this.userService.findUserbyId(user_id);
      await this.update(id, { status: "complete" });
      await this.silverService.create({
        client_id: user['_id'],
        "remarks": "player silver win game TrD:" + bet['_id'],
        "type": "credit",
        'game_id': bet.game_id,
        "coins": Number(user['silver_balance']) + Number(bet['silver']) + Number(bet['silver'])
      });
      return await this.userService.updateMobile(user['id'], { updated_by: "" });

    } else {
      return { status: false, message: "Already request proccessed" };
    }
  }

  async sendNotificationToUser(userId: string, message: string,title:string) {
    const user = await this.userService.findByUserId(userId);
    
    const payload = {
      title:title,
      body: message,
    };
    try{
       await this.notificationService.sendNotification(user.deviceToken, payload);
       return {status:true,message:'Notification sent.'};
    }catch (error) {
      return {status:false,message:error};
    }
   
  }

  async betSecondSilverUser(id, second_user) {

    const bet = await this.betsModel.findById(id);
    
    if (bet && bet.status == "inactive" && Number(bet.silver) > 0) {
      const user = await this.userService.findUserbyId(second_user);
      console.log(user);
      if (user && Number(user['silver_balance']) > Number(bet['silver'])) {
        // make new api where user coin detect when accept 
        // await this.userService.UpdateUser(user['id'], Number(user['silver_balance']) - Number(bet['silver']), 'silver');
        await this.betsModel.findByIdAndUpdate(id, {
          status: "inprocess",
          second_player: second_user,
          second_email: user.email,
          second_name: user.first_name,
          second_user_id: user.userId,
          second_user_country: user.country,
          second_join_time: new Date().toISOString()
        });
        const updateBet = await this.betsModel.findById(id);
        return { ...await this.userService.getUserRenewTokenForMobile(user['id']), bet: updateBet, game: await this.gameService.findOne(updateBet['game_id']) };
      } else {
        return { status: false, message: "Invalid Coin not enough" };
      }

    } else {
      
      return { status: false, message: "Already bet in progress!!!" };
    }
  }
  async betSecondGoldUser(id, second_user) {
    const bet = await this.betsModel.findById(id);
    if (bet && bet.status == "inactive" && Number(bet.gold) > 0) {
      const user = await this.userService.findUserbyId(second_user);

      if (user && Number(user['gold_balance']) >= Number(bet['gold'])) {
        // await this.userService.UpdateUser(user['id'], Number(user['gold_balance']) - Number(bet['gold']), 'gold');
        await this.betsModel.findByIdAndUpdate(id, {
          status: "inprocess",
          second_player: second_user,
          second_email: user.email,
          second_name: user.first_name,
          second_user_country: user.country,
          second_user_id: user.userId,
          second_join_time: new Date().toISOString()
        });
        const updateBet = await this.betsModel.findById(id);
        return { ...await this.userService.getUserRenewTokenForMobile(user['id']), bet: updateBet, game: await this.gameService.findOne(updateBet['game_id']) };
      } else {
        return { status: false, message: "Invalid Coin not enough" };
      }

    } else {
      return { status: false, message: "Already bet in progress....." };
    }
  }

  async betUpdateWinUserGold(id: string, user_id: string) {

    const bet = await this.betsModel.findById(id);
    if (bet && bet.status == "active") {
      const user = await this.userService.findUserbyId(user_id);
      const winprice = Number(bet['gold']) + Number(bet['gold']);
      const game = await this.gameService.findOne(bet.game_id);
      const commission = Math.ceil((Number(game.commission) / 100) * winprice);
      const userprice = winprice - commission;

      await this.adminAcountService.create({
        "remarks": "game commission TrD:" + bet['_id'],
        "credit": commission,
        "debit": "0",
        "user_id": user['id'],
        country: user['country'],
        bet_id: id,
        first_player: bet.first_player,
        second_player: bet.second_player,
        game_id: game.id,
        type: 'commission_bet'
      });

      // const admin = await this.userService.findByEmail(process.env.DF_EMAIL);

      // await this.userService.update(admin.id,{gold_balance:Number(admin.gold_balance)+commission});

      await this.goldService.create({
        client_id: user['_id'],
        remarks: "game win TrD:" + bet['_id'],
        type: "credit",
        game_id: bet.game_id,
        coins: userprice,
        transaction_id: bet['transaction_id'],
        transaction_status: "game_win",
      });
      await this.update(id, { status: "complete", winner: user['_id'], admin_commission: commission, user_coins: userprice });

      ////////////admin commumation///////////////
      return await this.userService.getUserRenewTokenForMobile(user['id']);
    } else {
      return { status: false, message: "Already request proccessed" };
    }
  }
  async findAll(page = 0, perPage = 20, status = '', date = [], value = null, myRole = "", myCountries = "") {
    const query = { second_player: { $ne: "ai" } };
    if (status == 'active') {
      query['status'] = 'active';
    } else if (status == 'inactive') {
      query['status'] = 'inactive';
    } else if (status == 'complete') {
      query['status'] = 'complete';
    }
    if (myRole != "Admin" && myRole != "admin") query['first_user_country'] = { $in: myCountries.split(", ") };
    if (date.length > 0) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);
      query['createdAt'] = { $gte: parsedStartDate, $lte: parsedEndDate };
    }
    if (value) {
      query['$or'] = [
        { first_name: { $regex: value, $options: 'i' } },
        { first_email: { $regex: value, $options: 'i' } },
        { first_user_id: { $regex: value, $options: 'i' } },
        { second_name: { $regex: value, $options: 'i' } },
        { second_email: { $regex: value, $options: 'i' } },
        { second_user_id: { $regex: value, $options: 'i' } },
      ];
    }
    let totalCount = await this.betsModel.find(query).sort({ createdAt: -1 }).countDocuments().exec();
    const totalPages = Math.ceil(totalCount / perPage);
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }
    const skip = (page - 1) * perPage;
    let data = [];
    try {
      data = await this.betsModel.find(query).populate('first_player').populate('second_player').populate('game_id').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
    } catch (error) {
      data = [];
    }
    return {
      data: data,
      currentPage: page,
      totalPages,
      perPage,
      total_count: totalCount,
    };


    // const user = await this.userModel.find();
    // return user;
  }
  async ignore_count(id) {
    const bet = await this.betsModel.findOne({ _id: id }).populate('game_id').populate('first_player');

    if (bet) {
      if (Number(bet.game_id['ignore_bet']) >= Number(bet['ignore_count'])) {
        await this.betsModel.updateOne({ _id: id }, { ignore_count: Number(bet['ignore_count']) + 1 ,second_player:"",second_user_country:""});
        return { status: true, message: "bet ignore updated successfully." }
      } else {
        await this.userService.update(bet.first_player['_id'], { bet_block: bet.first_player['bet_block'].concat(bet.game_id['game_id']) });
        return { status: true, message: "First User bet ignore Blocked." }
      }
    } else {
      return { status: false, message: "No bet found." }
    }

  }
  async acceptBet(id){
    const bet = await this.betsModel.findOne({ _id: id });
    if(bet && bet.status=="inprocess"){
      const user = await this.userService.findUserbyId(bet.second_player);
      if( Number(bet['silver'])){
         await this.userService.UpdateUser(user['id'], Number(user['silver_balance']) - Number(bet['silver']), 'silver');
      }else if(Number(bet['gold'])){
        await this.userService.UpdateUser(user['id'], Number(user['gold_balance']) - Number(bet['gold']), 'gold');
      }else{
        return {status:false,message:"Request is not good."};
      }
   
    await this.betsModel.findOneAndUpdate({_id:id},{status:'active'});
    const updateBet = await this.betsModel.findById(id);
    return { ...await this.userService.getUserRenewTokenForMobile(bet.first_player), bet: updateBet, game: await this.gameService.findOne(updateBet['game_id']) };
    }
      return {status:false,message:"bet not found."}
  }

  async reject_counter(id) {
    const bet = await this.betsModel.findOne({ _id: id }).populate('game_id').populate('first_player');

    if (bet) {
      if (Number(bet.game_id['reject_bet']) >= Number(bet['reject_counter'])) {
        await this.betsModel.updateOne({ _id: id }, { reject_counter: Number(bet['reject_counter']) + 1 ,second_player:"",second_user_country:""});
        return { status: true, message: "bet reject updated successfully." }
      } else {
        await this.userService.update(bet.first_player['_id'], { bet_block: bet.first_player['bet_block'].concat(bet.game_id['game_id']) });
        return { status: true, message: "First User bet ignore Blocked." }
      }
    } else {
      return { status: false, message: "No bet found." }
    }

  }
  async reverseBet(id) {
    const bet = await this.betsModel.findOne({ _id: id });
    if (bet && bet.status != 'cancel') {


      const first_user = await this.userService.findUserbyId(bet.first_player);

      if (bet.silver != '0') {
        await this.userService.UpdateUser(first_user['id'], Number(first_user['silver_balance']) + Number(bet['silver']), 'silver');
      } if (bet.gold != '0') {
        await this.userService.UpdateUser(first_user['id'], Number(first_user['gold_balance']) + Number(bet['gold']), 'gold');
      }

      if (bet.second_player) {
        const second_user = await this.userService.findUserbyId(bet.second_player);
        if (bet.silver != '0') {
          await this.userService.UpdateUser(second_user['id'], Number(second_user['silver_balance']) + Number(bet['silver']), 'silver');
        } if (bet.gold != '0') {
          await this.userService.UpdateUser(second_user['id'], Number(second_user['gold_balance']) + Number(bet['gold']), 'gold');
        }
      }
      await this.betsModel.findByIdAndUpdate(id, { status: "cancel" });
      return { status: true, message: "Bet reverse successfully." };

    } else {
      return { status: false, message: "Bet Cancel already." };
    }
  }

  async game_history(page = 1, perPage = 20, _id: string, game = "") {

    try {
      let query: any = {
        gold: { $ne: '0' },
        status: "complete",
        $or: [{ first_player: _id }, { second_player: _id }]
      };
      if (game !== "") {
        const gameObj = await this.gameService.findbyId(game);
        if (!gameObj)
          return {
            status: false,
            message: "not history found",
            gamehistory: [],
            currentPage: page,
            totalPages: 1,
            perPage,
            total_count: 1,
          };
        else {
          game = gameObj['_id']

          query.game_id = new mongoose.Types.ObjectId(game);
        }

      }

      ///////////////////////////////////////////////////////////////////// counter search
      let totalCount = 0
      totalCount = await this.betsModel.find(query).countDocuments().exec();
      const totalPages = Math.ceil(totalCount / perPage);
      let message = "not history found"


      if (page < 1) {
        page = 1;
      } else if (page > totalPages) {
        page = totalPages;
      }

      const skip = (page - 1) * perPage;
      ///////////////////////////////////////////////////////////////////// counter search

      const data = await this.betsModel
        .find(query)
        // .select('transaction_id gold winner createdAt')
        .populate('game_id')
        .populate('first_player')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .exec();

      const modifiedData = data.map((item: any) => ({
        transaction_id: item.transaction_id,
        gold: item.gold,
        gamedetail: item.game_id,
        user_coins: item.winner == _id ? item.user_coins : item.gold,
        createdAt: item.createdAt,
        status: item.winner == _id ? 'won' : 'lost',
      }));

      if (data.length > 0) message = "game history found"
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
        status: false,
        message: "not history found",
        gamehistory: [],
        currentPage: page,
        totalPages: 1,
        perPage,
        total_count: 1,
      };
    }

  }
  ///////cron
  @Cron(CronExpression.EVERY_5_MINUTES, { name: "bet-expired-cron" })
  async sendRequest() {

    this.eventEmitter.emit(
      'bet-expire',
    );
    console.log("send bet request.....");
  }
  @OnEvent("bet-expire")
  async eventDailyReward() {
    const bets: any = await this.betsModel.find({status:"inactive"}).populate('game_id').populate('first_player').exec();
    for (let c = 0; c < bets.length; c++) {
      //  current date match//
      const today = moment();
      const startDate = moment(bets[c].createdAt).add(bets[c].game_id.challenge_time_minutes, 'minutes');
      
      if (startDate.isBefore(today)) {
         await this.betsModel.findByIdAndUpdate(bets[c]._id,{status:"expired"});
         if(Number(bets[c].silver)){
          await this.userService.UpdateUser(bets[c].first_player._id, Number(bets[c].first_player.silver_balance) + Number(bets[c].silver), 'silver');
         }
         if(Number(bets[c].gold)){
          await this.userService.UpdateUser(bets[c].first_player._id, Number(bets[c].first_player.gold_balance) + Number(bets[c].gold), 'gold');
         }
         
          console.log('Request processed.......!')
      }
       
    }
    return "Task Processed?";

  }
 

}

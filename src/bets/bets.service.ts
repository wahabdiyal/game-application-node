import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bets } from './schemas/bets.schema';
import mongoose from 'mongoose';
 
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
    private adminAcountService : AdminAccountsService,
    private goldService:GoldsService,
    private silverService:SilversService,
  ) { }
  async create(createbetDto: CreateBetDto) {
    const first_user = await this.userService.findUserbyId(createbetDto['first_player']);
    const today = new Date();
      const userBet = await this.betsModel.find({
        first_player: createbetDto['first_player'],
        createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), },
      }).countDocuments().exec();
   const game = await this.gameService.findbyId(createbetDto['game_id']);
      if(game && Number(game.maximum_challenges) < userBet)
       {
        return { status:false,message:"Challenges exceeded"};
       }
     
//     if(createbetDto['second_player'] === "hacked"){
//     if ( Number(first_user['silver_balance']) > Number(createbetDto['silver']) && createbetDto['second_player'] === "hacked") {
 
  
      if(!game){
              return {status:false,message:"Game not found"};
      }
      createbetDto['game_id'] = game._id;
    if(createbetDto['second_player'] === "ai"){
    if ( Number(first_user['silver_balance']) > Number(createbetDto['silver']) && createbetDto['second_player'] === "ai") {
 
          await this.userService.UpdateUser(first_user['id'],Number(first_user['silver_balance']) - Number(createbetDto['silver']),'silver');
       const res = await this.betsModel.create({...createbetDto,first_email:first_user['email'],first_name:first_user['first_name'],last_name:first_user['last_name'],first_user_id:first_user['userId']});
       return {...await this.userService.fetchUserProfile(first_user['email']),bet:res,game:game};
    }
    else{
        return {status:false,message:"Coin is not enough to play."}
    } 
    
  } 
  /////////////////////////silver coin//////////////////////
  if (Number(first_user['silver_balance']) > Number(createbetDto['silver']) && Number(createbetDto['silver']) != 0 ) {
       await this.userService.UpdateUser(first_user['id'],Number(first_user['silver_balance']) - Number(createbetDto['silver']),'silver');  
       const res = await this.betsModel.create({...createbetDto,first_email:first_user['email'],first_name:first_user['first_name'],last_name:first_user['last_name'],first_user_id:first_user['userId']});
       return {...await this.userService.fetchUserProfile(first_user['email']),bet:res,game:game};
    }
    ////// gold/////////////
    else if ( Number(first_user['gold_balance']) > Number(createbetDto['gold']) && Number(createbetDto['gold'])!=0) {
      /////playing with gold /////
      await this.userService.UpdateUser(first_user['id'],Number(first_user['gold_balance']) - Number(createbetDto['gold']),'gold');  
      const res = await this.betsModel.create({...createbetDto,first_email:first_user['email'],first_name:first_user['first_name'],last_name:first_user['last_name'],first_user_id:first_user['userId']});
      return {...await this.userService.fetchUserProfile(first_user['email']),bet:res,game:game};
    }
   else{
      return { status:false, message:"Invalid inputs try again"};
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

  async betUpdateLoseWin(id:string,status:boolean){
      const bet = await this.betsModel.findById(id);
      if(bet && bet.status != "complete"){
        const user = await this.userService.findUserbyId(bet.first_player);
        await this.update(id,{status:"complete"});
        if(status){
          await this.silverService.create({
            client_id:bet.first_player,
            remarks: "AI with silver in game and won",
            type:"credit",
           game_id:bet.game_id,
            coins:Number(user['silver_balance'])+Number(bet['silver'])+Number(bet['silver'])
           });
          return  await this.userService.updateMobile(user['id'],{updated_by:""});
        // return  await this.userService.updateMobile(user['id'],{silver_balance:Number(user['silver_balance'])+Number(bet['silver'])+Number(bet['silver'])});
        } 
        ////////only for ai
        await this.silverService.create({
          client_id:user['_id'],
          "remarks": "AI with silver in game and lose",
          "type":"debit",
         'game_id':bet.game_id,
          "coins":0
         });
        return  await this.userService.updateMobile(user['id'],{silver_balance:Number(user['silver_balance'])});

      }else{
        return {status:false,message:"Already request proccessed"};
      }
  }

  async betUpdateWinUser(id:string,user_id:string ){
    const bet = await this.betsModel.findById(id);
      if(bet && bet.status == "active"){
      const user = await this.userService.findUserbyId(user_id);
      await this.update(id,{status:"complete"});
      await this.silverService.create({
        client_id:user['_id'],
        "remarks": "Player with silver in game and won",
        "type":"credit",
       'game_id':bet.game_id,
        "coins":Number(user['silver_balance'])+Number(bet['silver'])+Number(bet['silver'])
       });
      return  await this.userService.updateMobile(user['id'],{updated_by:""});
       
    }else{
      return {status:false,message:"Already request proccessed"};
    }
}

  async betSecondSilverUser(id,second_user){
 
    const bet = await this.betsModel.findById(id);
    if(bet && bet.status == "inactive"&& Number(bet.silver) > 0){
      const user = await this.userService.findUserbyId(second_user);
      
      if(user &&  Number(user['silver_balance']) > Number(bet['silver'])){
          await this.userService.UpdateUser(user['id'],Number(user['silver_balance']) - Number(bet['silver']),'silver');
          await this.betsModel.findByIdAndUpdate(id,{status:"active",second_player:second_user,second_email:user.email,second_name:user.first_name,second_user_id:user.userId});
          const updateBet = await this.betsModel.findById(id);
         return {...await this.userService.getUserRenewTokenForMobile(user['id']),bet:updateBet,game:await this.gameService.findOne(updateBet['game_id'])}; 
      }else{
        return {status:false,message:"Invalid Coin not enough"};
      }
 
    }else{
      return {status:false,message:"Already bet in progress"};
    }
  }
  async betSecondGoldUser(id,second_user){
    const bet = await this.betsModel.findById(id);
    if(bet && bet.status == "inactive"&& Number(bet.gold) > 0){
      const user = await this.userService.findUserbyId(second_user);
      
      if(user &&  Number(user['gold_balance']) >= Number(bet['gold'])){
          await this.userService.UpdateUser(user['id'],Number(user['gold_balance']) - Number(bet['gold']),'gold');
          await this.betsModel.findByIdAndUpdate(id,{status:"active",second_player:second_user,second_email:user.email,second_name:user.first_name,second_user_id:user.userId});
          const updateBet = await this.betsModel.findById(id);
         return {...await this.userService.getUserRenewTokenForMobile(user['id']),bet:updateBet,game:await this.gameService.findOne(updateBet['game_id'])}; 
      }else{
        return {status:false,message:"Invalid Coin not enough"};
      }
 
    }else{
      return {status:false,message:"Already bet in progress"};
    }
  }

  async betUpdateWinUserGold(id:string,user_id:string ){
     
    const bet = await this.betsModel.findById(id);
      if(bet && bet.status == "active"){
      const user = await this.userService.findUserbyId(user_id);
      const winprice = Number(bet['gold'])+Number(bet['gold']);
      const game = await this.gameService.findOne(bet.game_id);
       const commission = Math.ceil((Number(game.commission) /100)*winprice);
       const userprice = winprice-commission;
      
       await this.adminAcountService.create({
        "remarks":"Get commission from player",
        "credit":commission,
        "debit":"0",
        "user_id":user['id'],
        country:user['country'],
        bet_id:id,
        first_player:bet.first_player,
        second_player:bet.second_player,
        game_id:game.id,
        type:'commission_bet'
       });
      
      // const admin = await this.userService.findByEmail(process.env.DF_EMAIL);

      // await this.userService.update(admin.id,{gold_balance:Number(admin.gold_balance)+commission});
     
        await this.goldService.create({
        client_id:user['_id'],
        "remarks": "Player with gold in game and won",
        "type":"credit",
       'game_id':bet.game_id,
        "coins": userprice
       });
      await this.update(id,{status:"complete",winner:user['_id']});

      ////////////admin commumation///////////////
      return await this.userService.getUserRenewTokenForMobile(user['id']);
    }else{
      return {status:false,message:"Already request proccessed"};
    }
}
async findAll(page = 0, perPage = 20,status='',date=[],value=null) {
  const query = {};
  if(status=='active'){
    query['status']='active';
  }else if(status=='inactive'){
    query['status']='inactive';
  }else if(status=='complete'){
    query['status']='complete';
  }
  if (date.length > 0) {
    const parsedStartDate = new Date(date[0].start);
    const parsedEndDate = new Date(date[0].end);
      query['createdAt']={ $gte: parsedStartDate, $lte: parsedEndDate };
  }
  if(value){
    query['$or']=[
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
      data = await this.betsModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
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

}

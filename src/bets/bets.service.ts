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

@Injectable()
export class BetsService {
  constructor(
    @InjectModel(Bets.name)
    private betsModel: mongoose.Model<Bets>,
    private userService: UserService,
    private gameService: GamesService,
    private adminAcountService : AdminAccountsService,
    private goldService:GoldsService
  ) { }
  async create(createbetDto: CreateBetDto) {
    const first_user = await this.userService.findUserbyId(createbetDto['first_player']);
     
    if(createbetDto['second_player'] === "ai"){
    if ( Number(first_user['silver_balance']) > Number(createbetDto['silver']) && createbetDto['second_player'] === "ai") {
          await this.userService.UpdateUser(first_user['id'],Number(first_user['silver_balance']) - Number(createbetDto['silver']),'silver');
       const res = await this.betsModel.create(createbetDto);
       return {...await this.userService.fetchUserProfile(first_user['email']),bet:res};
    }
    else{
        return {status:false,message:"Coin is not enough to play."}
    } 
    
  } 
  /////////////////////////silver coin//////////////////////
  if (Number(first_user['silver_balance']) > Number(createbetDto['silver']) && Number(createbetDto['silver']) != 0 ) {
       await this.userService.UpdateUser(first_user['id'],Number(first_user['silver_balance']) - Number(createbetDto['silver']),'silver');  
       const res = await this.betsModel.create(createbetDto);
       return {...await this.userService.fetchUserProfile(first_user['email']),bet:res};
    }
    ////// gold/////////////
    else if ( Number(first_user['gold_balance']) > Number(createbetDto['gold']) && Number(createbetDto['gold'])!=0) {
      /////playing with gold /////
      await this.userService.UpdateUser(first_user['id'],Number(first_user['gold_balance']) - Number(createbetDto['gold']),'gold');  
      const res = await this.betsModel.create(createbetDto);
      return {...await this.userService.fetchUserProfile(first_user['email']),bet:res};
    }
   else{
      return { status:false, message:"Invalid inputs try again"};
    }  


  }

  async findAll() {
    return await this.betsModel.find();
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
        return  await this.userService.updateMobile(user['id'],{silver_balance:Number(user['silver_balance'])+Number(bet['silver'])+Number(bet['silver'])});
        } 
        ////////only for ai
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
       
      return  await this.userService.updateMobile(user['id'],{silver_balance:Number(user['silver_balance'])+Number(bet['silver'])+Number(bet['silver'])});
       
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
          await this.betsModel.findByIdAndUpdate(id,{status:"active",second_player:second_user});
         return {...await this.userService.getUserRenewTokenForMobile(user['id']),bet:await this.betsModel.findById(id)}; 
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
          await this.betsModel.findByIdAndUpdate(id,{status:"active",second_player:second_user});
         return {...await this.userService.getUserRenewTokenForMobile(user['id']),bet:await this.betsModel.findById(id)}; 
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
       });
      
      // const admin = await this.userService.findByEmail(process.env.DF_EMAIL);

      // await this.userService.update(admin.id,{gold_balance:Number(admin.gold_balance)+commission});
     
        await this.goldService.create({
        client_id:user['_id'],
        "remarks": "Player with gold in game and won",
        "type":"credit",
       
        "coins": userprice
       });
      await this.update(id,{status:"complete"});

      ////////////admin commumation///////////////
      return await this.userService.getUserRenewTokenForMobile(user['id']);
    }else{
      return {status:false,message:"Already request proccessed"};
    }
}

}

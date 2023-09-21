import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bets } from './schemas/bets.schema';
import mongoose from 'mongoose';
import { UserService } from 'src/user/user.service';
import { GamesService } from 'src/games/games.service';

@Injectable()
export class BetsService {
  constructor(
    @InjectModel(Bets.name)
    private betsModel: mongoose.Model<Bets>,
    private userService: UserService,
    private gameService: GamesService
  ) { }
  async create(createbetDto: CreateBetDto) {
    const first_user = await this.userService.findUserbyId(createbetDto['first_player']);
     
    if(createbetDto['second_player'] === "ai"){
    if ( Number(first_user['silver_balance']) > Number(createbetDto['silver']) && createbetDto['second_player'] === "ai") {
          await this.userService.UpdateUser(first_user['id'],Number(first_user['silver_balance'])-Number(createbetDto['silver']),'silver');
      var res = await this.betsModel.create(createbetDto);
      return res;
    }
    else{
        return {status:false,message:"Coin is not enough to play."}
    } 
    
  } 
  if (Number(first_user['silver_balance']) > Number(createbetDto['silver']) &&Number(createbetDto['silver'])!=0 ) {
      /////playing with silver /////
      var res = await this.betsModel.create(createbetDto);
      return res;
    }else if ( Number(first_user['gold_balance']) > Number(createbetDto['gold']) && Number(createbetDto['gold'])!=0) {
      /////playing with gold /////
      // const second_player = await this.userService.findUserbyId(createbetDto['second_player']);
      return 1;
      var res = await this.betsModel.create(createbetDto);
      return res;
     
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
}

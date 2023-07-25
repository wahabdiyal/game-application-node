import { Injectable } from '@nestjs/common';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SiliverCoin } from './schemas/silver_coin.schema';
import { GoldCoin } from './schemas/gold_coin.schema';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(SiliverCoin.name)
    @InjectModel(GoldCoin.name)
    private silvercoinModel: mongoose.Model<SiliverCoin>,
    private goldcoinModel: mongoose.Model<GoldCoin>,
    ){}

   async  create(createCoinDto: CreateCoinDto): Promise<SiliverCoin>  {
     var res = await this.silvercoinModel.create(createCoinDto);
      return res;
     
     }
 

 async findAll():Promise<any[]>{
   const coin = await this.silvercoinModel.find();
   return coin;
}

  findOne(id: number) {
    return `This action returns a #${id} coin`;
  }

  update(id: number, updateCoinDto: UpdateCoinDto) {
    return `This action updates a #${id} coin`;
  }

  remove(id: number) {
    return `This action removes a #${id} coin`;
  }
}

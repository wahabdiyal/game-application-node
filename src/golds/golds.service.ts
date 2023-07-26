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
      ){}

  async create(createGoldDto: CreateGoldDto) :Promise<Gold>  {
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
  const user = await this.goldModel.findByIdAndUpdate(id,body);

  if (!user) {
    throw new NotFoundException('Silver Coin  not found.');
  }

  return {status: true,message: "Silver Coin updated successfully"};
}

  remove(id: number) {
    return `This action removes a #${id} gold`;
  }
}

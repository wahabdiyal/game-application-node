import { Injectable } from '@nestjs/common';
import { CreateCoinTraDto } from './dto/create-coin_tra.dto';
import { UpdateCoinTraDto } from './dto/update-coin_tra.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Silver } from 'src/silvers/schemas/silver_coin.schema';
import mongoose from 'mongoose';
import { Gold } from 'src/golds/schemas/gold_coin.schema';
import { CreateGoldDto } from 'src/golds/dto/create-gold.dto';

@Injectable()
export class CoinTrasService {
  constructor(
    @InjectModel(Silver.name)
    private silverModel: mongoose.Model<Silver>,
    @InjectModel(Gold.name)
    private goldModel: mongoose.Model<Gold>,
  ) {}
  async createGold(createGoldDto: CreateGoldDto): Promise<any> {
    var res = await this.goldModel.create(createGoldDto);
    return res;
  }
  async createSilver(createSilver): Promise<any> {
    var res = await this.silverModel.create(createSilver);
    return res;
  }
  findAll() {
    return `This action returns all coinTras`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coinTra`;
  }

  update(id: number, updateCoinTraDto: UpdateCoinTraDto) {
    return `This action updates a #${id} coinTra`;
  }

  remove(id: number) {
    return `This action removes a #${id} coinTra`;
  }
}

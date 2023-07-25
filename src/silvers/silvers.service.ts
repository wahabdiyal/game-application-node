import { Injectable } from '@nestjs/common';
import { CreateSilverDto } from './dto/create-silver.dto';
import { UpdateSilverDto } from './dto/update-silver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SiliverCoin } from 'src/coins/schemas/silver_coin.schema';
import mongoose from 'mongoose';
import { Silver } from './schemas/silver_coin.schema';

@Injectable()
export class SilversService {
  constructor(
    @InjectModel(Silver.name)
    private rewardModel: mongoose.Model<Silver>,
    ){}
 
  create(createSilverDto: CreateSilverDto) {
    return 'This action adds a new silver';
  }

  findAll() {
    return `This action returns all silvers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} silver`;
  }

  update(id: number, updateSilverDto: UpdateSilverDto) {
    return `This action updates a #${id} silver`;
  }

  remove(id: number) {
    return `This action removes a #${id} silver`;
  }
}

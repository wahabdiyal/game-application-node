import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSilverDto } from './dto/create-silver.dto';
import { UpdateSilverDto } from './dto/update-silver.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Silver } from './schemas/silver_coin.schema';
 

@Injectable()
export class SilversService {
  constructor(
    @InjectModel(Silver.name)
    private silverModel: mongoose.Model<Silver>,
    ){}
 
    async  create(createCoinDto: CreateSilverDto): Promise<Silver>  {
      var res = await this.silverModel.create(createCoinDto);
       return res;
      
      }

 async findAll(): Promise<Silver[]> {
    const silvers = await this.silverModel.find();
    return silvers;
  }

  async findOne(id:string): Promise<Silver>{
        const silver = await this.silverModel.findById(id);
        return silver;
  }

  async update(id: any, body:UpdateSilverDto) {
    const silver = await this.silverModel.findByIdAndUpdate(id,body);

    if (!silver) {
      throw new NotFoundException('Silver Coin  not found.');
    }

    return {status: true,message: "Silver Coin updated successfully"};
  }


  async remove(id: any) {
    const silver = await this.silverModel.findByIdAndDelete(id);

    if (!silver) {
      throw new NotFoundException('Silver Coin  not found.');
    }

    return {status: true,message: "Silver Coin Delete successfully"};
  }
      async findUserValue(id:any){
        return  await this.silverModel.find(id);
      }
}

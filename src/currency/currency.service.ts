import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Currency } from './schemas/currency.schema';
import mongoose from 'mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(Currency.name)
    private currencyService: mongoose.Model<Currency>,
    private readonly httpService: HttpService
  ){

  }
  async create(createCurrencyDto: CreateCurrencyDto) {
    
    var res = await this.currencyService.create(createCurrencyDto);
    return res;
  }

  async findAll(countryCode:any) {
    return  await this.currencyService.aggregate([
      {
        $match: {
          status: 'active',  
        },
      },
      {
        $unwind: '$data',  
      },
      {
        $match: {
          [`data.${countryCode}`]: { $exists: true }, // Filter by country code.
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field from the result if needed.
          [`data.${countryCode}`]: 1, // Include the desired country code data.
        },
      },
    ]);
  }

  findOne(id: any) {
    return `This action returns a #${id} currency`;
  }

  update(id: any, updateCurrencyDto: UpdateCurrencyDto) {
    return `This action updates a #${id} currency`;
  }

  remove(id: any) {
    return `This action removes a #${id} currency`;
  }
  ///////Crow Job ///////////////////
  @Cron('0 0 * * * *')
  async handleCron() {
   const del =  await this.currencyService.deleteMany({}).exec();
   
     const reqeust = await this.httpService.axiosRef.get('https://api.currencyapi.com/v3/latest?apikey=cur_live_kgCR3KsRY5KhognBym9AagVsJ97R57CrHG1cnWw1&base_currency=PKR');
     return this.currencyService.create(reqeust.data);
  }
}

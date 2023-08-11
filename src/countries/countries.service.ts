import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Country } from './schemas/countries.schema';
import mongoose from 'mongoose';

@Injectable()
export class CountriesService {
  constructor(
  @InjectModel(Country.name)
      private countryModel: mongoose.Model<Country>,
      ){}

  async create(createCountryDto: CreateCountryDto) {
    var res = await this.countryModel.create(createCountryDto);
    return res;
  }

  async findAll():Promise<Country[]> {
    return await this.countryModel.find().where('status','true').exec();
  }

 async findOne(id: any) {
    const country = await this.countryModel.findById(id);
    return country;
  }

  async update(id: any, updateCountryDto: UpdateCountryDto) {
    const country = await this.countryModel.findByIdAndUpdate(id,updateCountryDto);

    if (!country) {
      throw new NotFoundException('Country not found.');
    }
  
    return {status: true,message: "Country updated successfully"};
  }

 async remove(id: any) {
  const country = await this.countryModel.findByIdAndDelete(id);

  if (!country) {
    throw new NotFoundException('country not found.');
  }

  return {status: true,message: "country Delete successfully"};
  }
}

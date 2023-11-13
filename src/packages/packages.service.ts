import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Package } from './schemas/package.schema';
import { CurrencyService } from 'src/currency/currency.service';
import { CountriesService } from 'src/countries/countries.service';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name)
    private packagesModel: mongoose.Model<Package>,
    private currencyService: CurrencyService,
    private countryService: CountriesService,
  ) { }
  async create(createPackageDto: CreatePackageDto) {
    createPackageDto['country']=createPackageDto['country'].split(',')
    var res = await this.packagesModel.create(createPackageDto);
    return res;
  }

  async findAll(myRole = "", myCountries = "") {
    const query = {};
    if (myRole != "Admin" && myRole != "admin") query['country'] = { $in: myCountries.split(", ")};
    return await this.packagesModel.find(query).sort({ createdAt: -1 });
  }

  async findOne(id: any) {
    return await this.packagesModel.findOne({ _id: id });
  }

  async findbyCountry(country: any) {
    let packageValue = await this.packagesModel.find({country: country});
    
     const getcountry = await this.countryService.findOneByCountry(country.charAt(0).toUpperCase() + country.slice(1));

    if (getcountry) {
      let countryCurrency = await this.currencyService.findAll(getcountry.code);
      const crnc = getcountry.code;

      const exchangeRate = countryCurrency[0].data[crnc].value;

      const updatedPackageValue = [];

      for (const item of packageValue) {

        const newAmount = parseFloat(item.amount_usd) * exchangeRate;

        const updatedItem = {
          ...item.toObject(),
          amount: newAmount,
          user_country: country,
          currency: crnc,
        };

        // delete updatedItem.amount_usd;
        delete updatedItem.country;

        updatedPackageValue.push(updatedItem);
      }
      return updatedPackageValue;
   

    } else {
      return 0;
    }
  }
  async update(id: string, updatePackageDto: UpdatePackageDto) {
    updatePackageDto['country']=updatePackageDto['country'].split(',')
    const pakcage = await this.packagesModel.findByIdAndUpdate(id, updatePackageDto);

    if (!pakcage) {
      throw new NotFoundException('Package not found.');
    }

    const data = await this.packagesModel.findOne({ _id: id });

    return { status: true, data: data, message: "Package updated successfully" };
  }

  async remove(id: string) {
    const pack = await this.packagesModel.findByIdAndDelete(id);

    if (!pack) {
      throw new NotFoundException('Package not found.');
    }

    return { status: true, message: "Package Delete successfully" };
  }

  async findbyCountryForMobile(country: any) {
    let packageValue = await this.packagesModel.find({country:  { "$regex": country, "$options": "i" }});
 
    
     const getcountry = await this.countryService.findOneByCountry(country.charAt(0).toUpperCase() + country.slice(1));

    if (getcountry) {
      let countryCurrency = await this.currencyService.findAll(getcountry.code);
      const crnc = getcountry.code;
      if(!countryCurrency){
        return {status:false,message:"Currency not found"};
      }
       const exchangeRate = countryCurrency[0].data[crnc].value;

      const updatedPackageValue = [];

      for (const item of packageValue) {

        const newAmount = parseFloat(item.amount_usd) * exchangeRate;

        const updatedItem = {
          ...item.toObject(),
          amount: newAmount,
          user_country: country,
          currency: crnc,
        };

        // delete updatedItem.amount_usd;
        delete updatedItem.country;

        updatedPackageValue.push(updatedItem);
      }
      return {status:true,message:"Shop detail country",shopdata:updatedPackageValue};
   

    } else {
      return {status:false,message:"Country shop not found"};
    }
  }
}

import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateAdminBankDto } from './dto/create-admin_bank.dto';
import { UpdateAdminBankDto } from './dto/update-admin_bank.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AdminBank } from './schemas/admin_bank.schema';
import mongoose from 'mongoose';

@Injectable()
export class AdminBankService {
  constructor(
    @InjectModel(AdminBank.name)
    private adminBankService: mongoose.Model<AdminBank>,
  ) {}

  async create(createAdminBankDto: CreateAdminBankDto) {
    const adminCountry = createAdminBankDto['country'].toLowerCase();
    const country = await this.adminBankService.findOne({
      country: adminCountry,
    });
    if (country) {
      return { status: false, message: 'admin bank already exist.' };
    }
    var res = await this.adminBankService.create({
      ...createAdminBankDto,
      country: adminCountry,
    });
    return res;
  }
  async findByCountry(country: string) {
    return await this.adminBankService.find({ country: country });
  }
  async findAll(myRole = '', myCountries = '') {
    const query = {};
    if (myRole != 'Admin' && myRole != 'admin')
      query['country'] = {
        $in: myCountries
          .split(', ')
          .map((country) => country.trim().toLowerCase()),
      };
    return await this.adminBankService.find(query).sort({ createdAt: -1 });
  }
  async findOne(id: any) {
    return await this.adminBankService.findOne({ _id: id });
  }
  async findOneCountry(country: any) {
    return await this.adminBankService.findOne({ country: country });
  }
  async update(id: any, updateAdminBankDto: UpdateAdminBankDto) {
    updateAdminBankDto['country'] = updateAdminBankDto['country'].toLowerCase();
    const admin_bank = await this.adminBankService.findByIdAndUpdate(
      id,
      updateAdminBankDto,
    );

    if (!admin_bank) {
      throw new NotFoundException('admin bank not found.');
    }
    const data = await this.adminBankService.findOne({ _id: id });

    return {
      status: true,
      data: data,
      message: 'admin bank updated successfully',
    };
  }

  async remove(id: any) {
    const admin_bank = await this.adminBankService.findByIdAndDelete(id);

    if (!admin_bank) {
      throw new NotFoundException('admin bank not found.');
    }

    return { status: true, message: 'admin bank Delete successfully' };
  }

  async findOneCountryForMobile(country: any) {
    const getCountry = await this.adminBankService.findOne({
      country: country,
    });
    if (getCountry) {
      return {
        status: true,
        message: 'Admin country bank accounts',
        banksdata: getCountry,
      };
    } else {
      return { status: false, message: 'Not Acount Found.' };
    }
  }
}

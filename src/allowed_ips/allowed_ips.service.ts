
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAllowedIpDto } from './dto/create-allowed_ip.dto';
import { UpdateAllowedIpDto } from './dto/update-allowed_ip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Allowed_IPs } from './schemas/allowed_ips.schema';
import mongoose from 'mongoose';

@Injectable()
export class AllowedIpsService {
  constructor(
    @InjectModel(Allowed_IPs.name)
    private allowedIpsService: mongoose.Model<Allowed_IPs>,
  ) { }

  async create(createAllowedIpDto: CreateAllowedIpDto) {
    var res = await this.allowedIpsService.create(createAllowedIpDto);
    return res;
  }


  async findAll() {
    return await this.allowedIpsService.find();
  }

  async findOne(id: any) {
    return await this.allowedIpsService.findOne({ _id: id });
  }
  async findOneCountry(country: any) {
    return await this.allowedIpsService.findOne({ country: country });
  }

  async update(id: any, updateAllowedIpDto: UpdateAllowedIpDto) {
    const admin_bank = await this.allowedIpsService.findByIdAndUpdate(id, updateAllowedIpDto);

    if (!admin_bank) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "created" };
  }

  async remove(id: any) {
    const admin_bank = await this.allowedIpsService.findByIdAndDelete(id);

    if (!admin_bank) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "deleted" };

  }
}

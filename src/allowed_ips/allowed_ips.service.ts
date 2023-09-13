import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAllowedIpDto } from './dto/create-allowed_ip.dto';
import { UpdateAllowedIpDto } from './dto/update-allowed_ip.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AllowedIP } from './schemas/allowed_ips.schema';

@Injectable()
export class AllowedIpsService {
  constructor(
    @InjectModel(AllowedIP.name)
    private allowedIPService: mongoose.Model<AllowedIP>,
  ) { }

  async create(createAllowedIpDto: CreateAllowedIpDto) {
    var res = await this.allowedIPService.create(createAllowedIpDto);
    return await this.allowedIPService.findOne({ _id: res._id });
  }
  async findByCountry(country: string) {
    return await this.allowedIPService.find({ country: country });
  }
  async findAll() {
    return await this.allowedIPService.find();
  }
  async findOne(id: any) {
    return await this.allowedIPService.findOne({ _id: id });
  }
  async update(id: any, updateAllowedIpDto: UpdateAllowedIpDto) {
    const admin_bank = await this.allowedIPService.findByIdAndUpdate(id, updateAllowedIpDto);

    if (!admin_bank) {
      throw new NotFoundException('not found.');
    }
    const data = await this.allowedIPService.findOne({ _id: id });

    return { status: true, data: data, message: "updated" };
  }

  async remove(id: any) {
    const admin_bank = await this.allowedIPService.findByIdAndDelete(id);

    if (!admin_bank) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "removed" };

  }
  async findUserIp(ip,user_id){
    
    const userIp =  await this.allowedIPService.find({ ip_address: ip, user_id: user_id});
    if (!userIp.length) {
    return { status: false, message: "not ip found" };
    }
    return userIp;
  }
}

import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateAllowedIpDto } from './dto/create-allowed_ip.dto';
import { UpdateAllowedIpDto } from './dto/update-allowed_ip.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from "src/user/schemas/user.schema";
import { AllowedIP } from './schemas/allowed_ips.schema';
import { AuthGuard } from 'src/auth/auth.guard';
@Injectable()
@UseGuards(AuthGuard)
export class AllowedIpsService {
  constructor(
    @InjectModel(AllowedIP.name)
    private allowedIPService: mongoose.Model<AllowedIP>,
  ) { }

  async create(createAllowedIpDto: CreateAllowedIpDto) {
    var res = await this.allowedIPService.create(createAllowedIpDto);
    return await this.allowedIPService.findOne({ _id: res._id }).populate('user');
  }
  async findByCountry(country: string) {
    return await this.allowedIPService.find({ country: country });
  }
  async findAll() {
    return await this.allowedIPService.find().populate('user');
  }
  async findOne(id: any) {
    return await this.allowedIPService.findOne({ _id: id });
  }
  async update(id: any, updateAllowedIpDto: UpdateAllowedIpDto) {
    const ips = await this.allowedIPService.findByIdAndUpdate(id, updateAllowedIpDto);

    if (!ips) {
      throw new NotFoundException('not found.');
    }
    const data = await this.allowedIPService.findOne({ _id: id }).populate('user');;

    return { status: true, data: data, message: "updated" };
  }

  async remove(id: any) {
    const ips = await this.allowedIPService.findByIdAndDelete(id);

    if (!ips) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "removed" };

  }
  async findUserIp(ip, user) {
    return await this.allowedIPService.findOne({
      user: user, // Assuming user_id is a string
      ip_address: ip,
    });
  }

  async findUserIpByUser(user) {
    return await this.allowedIPService.findOne({
      user: user,
    });
  }
}

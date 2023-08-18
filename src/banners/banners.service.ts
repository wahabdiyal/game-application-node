import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './schemas/banner.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name)
    private bannerModel: mongoose.Model<Banner>,
    ){}

  async create(createBannerDto: CreateBannerDto) {
   
  var res = await this.bannerModel.create(createBannerDto);
   return res;
  }

 async findAll() {
    return await this.bannerModel.find();
  }

 async findOne(id: any) {
    return await this.bannerModel.findOne({_id : id});
  }

  async update(id: any, updateBannerDto: UpdateBannerDto) {
    const banner = await this.bannerModel.findByIdAndUpdate(id,updateBannerDto);

    if (!banner) {
      throw new NotFoundException('banner not found.');
    }

    return {status: true,message: "banner updated successfully"};
  }
  
  async remove(id: any) {
    const banner = await this.bannerModel.findByIdAndDelete(id);

    if (!banner) {
      throw new NotFoundException('banner not found.');
    }

    return {status: true,message: "banner Delete successfully"};
  }
}

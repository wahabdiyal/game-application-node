import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateBannerCollectionDto } from './dto/create-banner_collection.dto';
import { UpdateBannerCollectionDto } from './dto/update-banner_collection.dto';
import { BannerCollection } from './schemas/banner_collection.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BannerCollectionsService {
  constructor(
    @InjectModel(BannerCollection.name)
    private bannerCollectionModel: mongoose.Model<BannerCollection>,
    ){}

  async create(createBannerCollectionDto: CreateBannerCollectionDto) {
    var res = await this.bannerCollectionModel.create(createBannerCollectionDto);
    return res;
  }

  async findAll() {
    return await this.bannerCollectionModel.find();
  }

 async findOne(id: any) {
    return await this.bannerCollectionModel.findOne({_id : id});
  }

 async update(id: any, updateBannerCollectionDto: UpdateBannerCollectionDto) {
    const banner = await this.bannerCollectionModel.findByIdAndUpdate(id,updateBannerCollectionDto);

    if (!banner) {
      throw new NotFoundException('banner collection not found.');
    }

    return {status: true,message: "banner collection updated successfully"};
  }

 async remove(id: any) {
    const banner = await this.bannerCollectionModel.findByIdAndDelete(id);

    if (!banner) {
      throw new NotFoundException('banner not found.');
    }

    return {status: true,message: "banner Delete successfully"};
  }
}

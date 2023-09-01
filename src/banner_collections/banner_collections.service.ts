 
import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateBannerCollectionDto } from './dto/create-banner_collection.dto';
import { UpdateBannerCollectionDto } from './dto/update-banner_collection.dto';
import { BannerCollection } from './schemas/banner_collection.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BannersService } from 'src/banners/banners.service';

@Injectable()
export class BannerCollectionsService {
  constructor(
    @InjectModel(BannerCollection.name)
    private bannerCollectionModel: mongoose.Model<BannerCollection>,
    private readonly bannerService:BannersService,
    ){}

  async create(createBannerCollectionDto: CreateBannerCollectionDto) {
    var res = await this.bannerCollectionModel.create(createBannerCollectionDto);
    return res;
  }

  async findAll() {
    return await this.bannerCollectionModel.find();
  }

 async findOne(country: any) {
  const collectionBanner =  await this.bannerCollectionModel.findOne({
    country: {
      $in: [country]
    }
  });
  if(collectionBanner!==null){

     const bannerList =  await this.bannerService.getBannerList(collectionBanner.banner_id);
     const newCollectionBanner = {...collectionBanner.toObject(),
       banner_list: bannerList
     };
          return {
            status:true,
            country:   newCollectionBanner ,
          };
  }else{
        return {
          status:false,
          message:"Country not found"
        };
     }
  }
  async find() {
    const collectionBanner =  await this.bannerCollectionModel.find();
    if(collectionBanner.length > 0) {
      let bannerlist = [];
  for (let i = 0; i < collectionBanner.length; i++) {
    const element = collectionBanner[i];
    const bannerListForElement = await this.bannerService.getBannerList(element.banner_id);
    bannerlist.push({
      ...element.toObject(),  
      banner_list: bannerListForElement,
    });
  }
    return {
        status:true,
        country: bannerlist ,
       };
    }else{
  
      return {
        status:false,
        message:"Country not found"
      };
    }
    
  
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
  async getAllBanners(){
    return await this.bannerCollectionModel.find();
  }
}

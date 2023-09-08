import { Module } from '@nestjs/common';
import { BannerCollectionsService } from './banner_collections.service';
import { BannerCollectionsController } from './banner_collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerCollectionSchema } from './schemas/banner_collection.schema';
import { BannersModule } from 'src/banners/banners.module';
 

@Module({
  imports:[MongooseModule.forFeature([{ name: 'BannerCollection', schema: BannerCollectionSchema }
]), BannersModule],
  controllers: [BannerCollectionsController],
  providers: [BannerCollectionsService],
  exports: [BannerCollectionsService]
})
export class BannerCollectionsModule {}

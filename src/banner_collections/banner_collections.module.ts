import { Module } from '@nestjs/common';
import { BannerCollectionsService } from './banner_collections.service';
import { BannerCollectionsController } from './banner_collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerCollectionSchema } from './schemas/banner_collection.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'BannerCollection', schema: BannerCollectionSchema }
])],
  controllers: [BannerCollectionsController],
  providers: [BannerCollectionsService],
  exports: [BannerCollectionsService]
})
export class BannerCollectionsModule {}

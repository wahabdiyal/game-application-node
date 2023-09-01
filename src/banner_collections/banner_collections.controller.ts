import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BannerCollectionsService } from './banner_collections.service';
import { CreateBannerCollectionDto } from './dto/create-banner_collection.dto';
import { UpdateBannerCollectionDto } from './dto/update-banner_collection.dto';

@Controller('banner-collections')
export class BannerCollectionsController {
  constructor(private readonly bannerCollectionsService: BannerCollectionsService) {}

  @Post()
  create(@Body() createBannerCollectionDto: CreateBannerCollectionDto) {
    return this.bannerCollectionsService.create(createBannerCollectionDto);
  }

  @Get()
  findAll() {
    return this.bannerCollectionsService.find();
  }

  @Get(':country')
  findOne(@Param('country') country: string) {
    return this.bannerCollectionsService.findOne(country);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannerCollectionDto: UpdateBannerCollectionDto) {
    return this.bannerCollectionsService.update(id, updateBannerCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerCollectionsService.remove(id);
  }
}

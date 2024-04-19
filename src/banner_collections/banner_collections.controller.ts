import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BannerCollectionsService } from './banner_collections.service';
import { CreateBannerCollectionDto } from './dto/create-banner_collection.dto';
import { UpdateBannerCollectionDto } from './dto/update-banner_collection.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('banner-collections')
@UseGuards(AuthGuard)
export class BannerCollectionsController {
  constructor(
    private readonly bannerCollectionsService: BannerCollectionsService,
  ) {}

  @Post()
  create(@Body() createBannerCollectionDto: CreateBannerCollectionDto) {
    return this.bannerCollectionsService.create(createBannerCollectionDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.bannerCollectionsService.find(req.user.role, req.user.country);
  }

  @Get('/getbannerwithid/:id')
  async findOneBannerwithid(@Param('id') id: string) {
    return await this.bannerCollectionsService.findBannerbyId(id);
  }

  @Get(':country')
  findOne(@Param('country') country: string) {
    return this.bannerCollectionsService.findOne(country);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBannerCollectionDto: UpdateBannerCollectionDto,
  ) {
    return this.bannerCollectionsService.update(id, updateBannerCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerCollectionsService.remove(id);
  }
}

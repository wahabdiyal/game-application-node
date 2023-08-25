import { storage } from './../config/storage.config';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,UploadedFile } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
 
@Controller('banners')
export class BannersController {
    
    constructor(
    private readonly bannersService: BannersService,
    
    ) {}
 
  @Post()
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(
    FileInterceptor(
      "file", // name of the field being passed
      { storage }
    )
  )
  //////add  path file save and folder location/////
  async create(@UploadedFile() file: Express.Multer.File,@Body() createBannerDto: CreateBannerDto) {
     
    return await this.bannersService.create({...createBannerDto,file_url:file.path});
  }

  @Get()
  findAll() {
    return this.bannersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {

    return this.bannersService.update(id, updateBannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }
}

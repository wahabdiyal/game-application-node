import { storage } from './../config/storage.config';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('banners')
@UseGuards(AuthGuard)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(
    FileInterceptor(
      'file', // name of the field being passed
      { storage },
    ),
  )
  //////add  path file save and folder location/////
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBannerDto: CreateBannerDto,
  ) {
    return await this.bannersService.create({
      ...createBannerDto,
      file_url: file.path
        .replace('public\\', '')
        .replace('\\', '/')
        .replace('public/', ''),
    });
  }

  @Get()
  findAll(@Request() req) {
    return this.bannersService.findAll(req.user.role, req.user.country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor(
      'file', // name of the field being passed
      { storage },
    ),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    // You can implement your logic here, e.g., finding the existing game by id and updating it
    // Then, you can update the file_url property similar to how you did in the create method

    const updatedGame = await this.bannersService.update(id, {
      ...updateBannerDto,
      file_url: file
        ? file.path
            .replace('public\\', '')
            .replace('\\', '/')
            .replace('public/', '')
        : undefined,
    });

    return updatedGame;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {

  //   return this.bannersService.update(id, updateBannerDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }
}

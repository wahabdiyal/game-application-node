import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors,Request, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from './../config/storage.config';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('packages')
@UseGuards(AuthGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) { }

  @Post()
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(
    FileInterceptor(
      "file", // name of the field being passed
      { storage }
    )
  )
  //////add  path file save and folder location/////
  async create(@UploadedFile() file: Express.Multer.File, @Body() createPackageDto: CreatePackageDto) {

    return await this.packagesService.create({ ...createPackageDto, file_url: file ? (file.path.replace("public\\", "")).replace("\\", "/").replace("public/", "") : '' });
  }

  @Get()
  findAll(@Request() req) {
    return this.packagesService.findAll(req.user.role,req.user.country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @Get('/country/:country')
  findByCountry(@Param('country') country: string) {
    return this.packagesService.findbyCountry(country);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor(
      "file", // name of the field being passed
      { storage }
    )
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePackageDto: UpdatePackageDto
  ) {
    // You can implement your logic here, e.g., finding the existing game by id and updating it
    // Then, you can update the file_url property similar to how you did in the create method

    const updatedGame = await this.packagesService.update(id, {
      ...updatePackageDto,
      file_url: file ? (file.path.replace("public\\", "")).replace("\\", "/").replace("public/", "") : undefined
    });

    return updatedGame;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }

  @Get('/country/mobile/:country')
  findByCountryMobile(@Param('country') country: string) {
    return this.packagesService.findbyCountryForMobile(country);
  }
}

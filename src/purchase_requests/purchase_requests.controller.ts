import { storage } from './../config/storage.config';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PurchaseRequestsService } from './purchase_requests.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase_request.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase_request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('purchase-requests')
export class PurchaseRequestsController {
  constructor(private readonly purchaseRequestsService: PurchaseRequestsService) { }

  @Post()
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(
    FileInterceptor(
      "file", // name of the field being passed
      { storage }
    )
  )
  //////add  path file save and folder location/////
  async create(@UploadedFile() file: Express.Multer.File, @Body() createBannerDto: CreatePurchaseRequestDto) {
    return await this.purchaseRequestsService.create({ ...createBannerDto, file_url: file ? (file.path.replace("public\\", "")).replace("\\", "/").replace("public/", "") : undefined });
  }

  @Get()
  findAll(@Query() { page, perpage, start_date, end_date, status,search }) {
    let date = (start_date && end_date) ? [{ start: start_date, end: end_date }] : [];
    return this.purchaseRequestsService.findByStatus(page, perpage, date, status,search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseRequestsService.findOne(id);
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
    @Body() updateBannerDto: UpdatePurchaseRequestDto
  ) {
    // You can implement your logic here, e.g., finding the existing game by id and updating it
    // Then, you can update the file_url property similar to how you did in the create method

    const updatedGame = await this.purchaseRequestsService.update(id, {
      ...updateBannerDto,
      file_url: file ? (file.path.replace("public\\", "")).replace("\\", "/").replace("public/", "") : undefined
    });

    return updatedGame;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseRequestsService.remove(id);
  }
  @Get("user/:id")
  getUser(@Param('id') id: string) {
    return this.purchaseRequestsService.findByUser(id);
  }


  // @Get("status/")
  // getByStatus(@Query() { page, perpage, start_date, end_date, status }) {
  //   let date = (start_date && end_date) ? [{ start: start_date, end: end_date }] : [];
  //   return this.purchaseRequestsService.findByStatus(page, perpage, date, status);
  // }
}

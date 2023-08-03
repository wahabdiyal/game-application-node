import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoldsService } from './golds.service';
import { CreateGoldDto } from './dto/create-gold.dto';
import { UpdateGoldDto } from './dto/update-gold.dto';

@Controller('golds')
export class GoldsController {
  constructor(private readonly goldsService: GoldsService) {}
  @Get('/data')
   fetchAllCoinCount() {
    return this.goldsService.fetchAllCoinCount();
  }
  @Post()
  create(@Body() createGoldDto: CreateGoldDto) {
    return this.goldsService.create(createGoldDto);
  }

  @Get()
  findAll() {
    return this.goldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    
    return this.goldsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateGoldDto: UpdateGoldDto) {
    return this.goldsService.update(id, updateGoldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.goldsService.remove(id);
  }
  @Get('user/:id')
  fetchAllCoinUserId(@Param('id') id: any) {
    return this.goldsService.fetchAllCoinUserId(id);
  }
  @Get('getcoin/status/:status')
  fetchCoinStatus(@Param('status') status: any) {
    return this.goldsService.fetchCoinStatus(status);
  }

}

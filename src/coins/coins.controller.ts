import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Post('silver')
  create(@Body() createCoinDto: CreateCoinDto) {
    return this.coinsService.create(createCoinDto);
  }

  @Get('silver')
  findAll() {
    return this.coinsService.findAll();
  }

  @Get('silver/:id')
  findOne(@Param('id') id: any) {
    return this.coinsService.findOne(id);
  }

  @Patch('silver/:id')
  update(@Param('id') id: any, @Body() updateCoinDto: UpdateCoinDto) {
    return this.coinsService.update(id, updateCoinDto);
  }

  @Delete('silver/:id')
  remove(@Param('id') id: any) {
    return this.coinsService.remove(id);
  }

  //////////////////Silver Coin////////////


  @Post('gold')
  createSilver(@Body() createCoinDto: CreateCoinDto) {
    return this.coinsService.create(createCoinDto);
  }

  @Get('gold')
  findAllSilver() {
    return this.coinsService.findAll();
  }

  @Get('gold/:id')
  findOneSilver(@Param('id') id: any) {
    return this.coinsService.findOne(id);
  }

  @Patch('gold/:id')
  updateSilver(@Param('id') id: any, @Body() updateCoinDto: UpdateCoinDto) {
    return this.coinsService.update(id, updateCoinDto);
  }

  @Delete('gold/:id')
  removeSilver(@Param('id') id: any) {
    return this.coinsService.remove(id);
  }
}

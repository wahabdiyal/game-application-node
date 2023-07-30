import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoinUserService } from './coin_user.service';
import { CreateCoinUserDto } from './dto/create-coin_user.dto';
import { UpdateCoinUserDto } from './dto/update-coin_user.dto';

@Controller('coin/user')
export class CoinUserController {
  constructor(private readonly coinUserService: CoinUserService) {}

  @Post()
  create(@Body() createCoinUserDto: CreateCoinUserDto) {
    return this.coinUserService.create(createCoinUserDto);
  }

  @Get()
  findAll() {
    return this.coinUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coinUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoinUserDto: UpdateCoinUserDto) {
    return this.coinUserService.update(+id, updateCoinUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coinUserService.remove(+id);
  }
}

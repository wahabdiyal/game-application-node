import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post("mobile")
  create(@Body() createBetDto: CreateBetDto) {
    return this.betsService.create(createBetDto);
  }

  @Get()
  findAll() {
    return this.betsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.betsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    return this.betsService.update(id, updateBetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.betsService.remove(id);
  }

  @Post('/user/betstatus/:id')
  async betUpdateLoseWin(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    
        return await this.betsService.betUpdateLoseWin(id,updateBetDto['status']);
  }

  @Post('/silver/bet/:id')
  async betSecondSilverUser(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    
        return await this.betsService.betSecondSilverUser(id,updateBetDto['second_user']);
  }
  @Post('/winner/bet/:id')
  async betUpdateWinUser(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
      return await this.betsService.betUpdateWinUser(id,updateBetDto['user_id']);
}
@Post('/gold/bet/:id')
async betSecondGoldUser(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
  
      return await this.betsService.betSecondGoldUser(id,updateBetDto['second_user']);
}

@Post('gold/winner/bet/:id')
async betUpdateWinUserGold(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    return await this.betsService.betUpdateWinUserGold(id,updateBetDto['user_id']);
}

}

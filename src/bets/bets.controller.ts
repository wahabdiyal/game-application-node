import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,Request, UseInterceptors } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('bets')
@UseGuards(AuthGuard)
export class BetsController {
  constructor(private readonly betsService: BetsService) { }

  @Post("mobile")
  create(@Body() createBetDto: CreateBetDto) {
    return this.betsService.create(createBetDto);
  }

  @Get()
  findAll(@Request() req,@Query() { page, perpage, status, start_date, end_date, key }) {
    let date = (start_date && end_date) ? [{ start: start_date, end: end_date }] : [];
    return this.betsService.findAll(page, perpage, status, date, key,req.user.role,req.user.country);
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
    return await this.betsService.betUpdateLoseWin(id, updateBetDto['winner']);
  }

  @Post('/silver/bet/:id')
  async betSecondSilverUser(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {

    return await this.betsService.betSecondSilverUser(id, updateBetDto['second_user']);
  }
  @Post('/winner/bet/:id')
  async betUpdateWinUser(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    return await this.betsService.betUpdateWinUser(id, updateBetDto['user_id']);
  }
  @Post('/gold/bet/:id')
  async betSecondGoldUser(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {

    return await this.betsService.betSecondGoldUser(id, updateBetDto['second_user']);
  }

  @Post('gold/winner/bet/:id')
  async betUpdateWinUserGold(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    return await this.betsService.betUpdateWinUserGold(id, updateBetDto['user_id']);
  }
  @Post('/ignore/update/:id')
  async ignoreUpdate(@Param('id') id: string) {
    return await this.betsService.ignore_count(id);
  }

  @Post('/reject/update/:id')
  async betReject(@Param('id') id: string) {
    return await this.betsService.reject_counter(id);
  }

  @Post('/accept/update/:id')
  async betAccept(@Param('id') id: string) {
    return await this.betsService.acceptBet(id);
  }

  @Post('reverse/:id')
  async reverseBet(@Param('id') id: string) {
    return await this.betsService.reverseBet(id);
  }

  @Get('/game/history')
  game_history(@Query() { page, perpage,player_id, game_id }) {
    return this.betsService.game_history(page, perpage,player_id, game_id);
  }
  @Post('send/notification')
  @UseInterceptors(
    FileInterceptor('')
  )
  sendNotification( @Body() req) {
   
    return this.betsService.sendNotificationToUser(req['userid'],req['message'],req['title']);
  }

}

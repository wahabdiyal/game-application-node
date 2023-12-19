import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,Request, UseInterceptors } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('bets')
//  @UseGuards(AuthGuard)
export class BetsController {
  constructor(private readonly betsService: BetsService) { }

  @Post("mobile")
  create(@Body() createBetDto: CreateBetDto) {
    return this.betsService.create(createBetDto);
  }
  @Post("first/second/player")
  createBetForFirstAndSecondUser(@Body() createBetDto: CreateBetDto) {
    return this.betsService.createBetForFirstAndSecondUser(createBetDto);
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
    return updateBetDto;
    return await this.betsService.betUpdateLoseWin(id, updateBetDto['winner']);
  }

  @Post('/silver/bet/:id/seconduser/:user_id/notification/:title/:message')
  async betSecondSilverUser(@Param('id') id: string, @Param('user_id') user_id: string, @Param('message') message: string, @Param('title') title: string) {

    return await this.betsService.betSecondSilverUser(id,user_id,title,message);
  }
  @Post('/winner/bet/:id/user/:userid')
  async betUpdateWinUser(@Param('id') id: string, @Param('userid') userid: string) {
    return await this.betsService.betUpdateWinUser(id,userid);
  }

  @Post('/lose/bet/:id/user/:userid')
  async betUpdateLoseUser(@Param('id') id: string, @Param('userid') userid: string) {
    return await this.betsService.betUpdateLoseUser(id, userid);
  }


  @Post('/gold/bet/:id/seconduser/:user_id/notification/:title/:message')
  async betSecondGoldUser(@Param('id') id: string, @Param('user_id') user_id: string, @Param('message') message: string, @Param('title') title: string) {

    return await this.betsService.betSecondGoldUser(id,user_id,title,message);
  }

  @Post('gold/winner/bet/:id/user/:userid')
  async betUpdateWinUserGold(@Param('id') id: string, @Param('userid') user_id: string) {
    return await this.betsService.betUpdateWinUserGold(id, user_id);
  }

  
  @Post('gold/lose/bet/:id/user/:userid')
  async betUpdateLoseUserGold(@Param('id') id: string, @Param('userid') user_id: string) {
    return await this.betsService.betUpdateLoseUserGold(id, user_id);
  }


  @Post('/ignore/update/:id')
  async ignoreUpdate(@Param('id') id: string) {
    return await this.betsService.ignore_count(id);
  }

  @Post('/reject/update/:id')
  async betReject(@Param('id') id: string) {
    return await this.betsService.reject_counter(id);
  }
  /////////second player reject request of first user //////
  @Post('/reject/second/player/:id')
  async rejectBySecondUser(@Param('id') id: string) {
    return await this.betsService.rejectBySecondUser(id);
  }

  @Get('/leave/update/:id')
  async betleaveSecond(@Param('id') id: string) {
    return await this.betsService.leaveBetSecond(id);
  }

  @Post('/accept/update/:id')
  async betAccept(@Param('id') id: string) {
    return await this.betsService.acceptBet(id);
  }

  @Post('/accept/request/second/player/:id')
  async acceptBetForFirstAndSecondPlayerJoin(@Param('id') id: string) {
    return await this.betsService.acceptBetForFirstAndSecondPlayerJoin(id);
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

  @Get('game/all_bets')
  get_games_bets() {
    return this.betsService.get_games_bets();
  }

 

}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Query } from '@nestjs/common';
import { SilversService } from './silvers.service';
import { CreateSilverDto } from './dto/create-silver.dto';
import { UpdateSilverDto } from './dto/update-silver.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('silvers')

export class SilversController {
  constructor(private readonly silversService: SilversService) {}
  @UseGuards(AuthGuard)
  @Get('/data')
  fetchAllCoinCount() {
   return this.silversService.fetchAllCoinCount();
 }
 @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSilverDto: CreateSilverDto) {
    return this.silversService.create(createSilverDto);
  }

  @Post('/apirequest/server/jk_y97wah')
  createApiRequest(@Body() createSilverDto: CreateSilverDto) {
    return this.silversService.createApiRequest(createSilverDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.silversService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.silversService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: any, @Body() updateSilverDto: UpdateSilverDto) {
    return this.silversService.update(id, updateSilverDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.silversService.remove(id);
  }
  @UseGuards(AuthGuard)
  @Get('user/:id')
  fetchAllCoinUserId(@Param('id') id: any,@Query() {page,perpage,start_date,end_date}) {
    let date = (start_date && end_date)?[{start:start_date,end:end_date}]:[];

    return this.silversService.fetchAllCoinUserId(id,page, perpage,date);
  }
  @UseGuards(AuthGuard)
  @Get('getcoin/:id')
  getuserbycoinId(@Param('id') id: any) {
    return this.silversService.getuserbycoinId(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SilversService } from './silvers.service';
import { CreateSilverDto } from './dto/create-silver.dto';
import { UpdateSilverDto } from './dto/update-silver.dto';

@Controller('silvers')
export class SilversController {
  constructor(private readonly silversService: SilversService) {}

  @Post()
  create(@Body() createSilverDto: CreateSilverDto) {
    return this.silversService.create(createSilverDto);
  }

  @Get()
  findAll() {
    return this.silversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.silversService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateSilverDto: UpdateSilverDto) {
    return this.silversService.update(id, updateSilverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.silversService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllowedIpsService } from './allowed_ips.service';
import { CreateAllowedIpDto } from './dto/create-allowed_ip.dto';
import { UpdateAllowedIpDto } from './dto/update-allowed_ip.dto';

@Controller('allowed-ips')
export class AllowedIpsController {
  constructor(private readonly allowedIpsService: AllowedIpsService) {}

  @Post()
  create(@Body() createAllowedIpDto: CreateAllowedIpDto) {
    return this.allowedIpsService.create(createAllowedIpDto);
  }

  @Get()
  findAll() {
    return this.allowedIpsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allowedIpsService.findOne(id);
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllowedIpDto: UpdateAllowedIpDto) {
    return this.allowedIpsService.update(id, updateAllowedIpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allowedIpsService.remove(id);
  }
}

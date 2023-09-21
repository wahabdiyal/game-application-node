import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginLogsService } from './login_logs.service';
import { CreateLoginLogDto } from './dto/create-login_log.dto';
import { UpdateLoginLogDto } from './dto/update-login_log.dto';

@Controller('login-logs')
export class LoginLogsController {
  constructor(private readonly loginLogsService: LoginLogsService) { }


  @Post()
  create(@Body() createLoginLogDto: CreateLoginLogDto) {

    return this.loginLogsService.create(createLoginLogDto);
  }

  @Get()
  findAll() {
    return this.loginLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginLogsService.findOne(id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoginLogDto: UpdateLoginLogDto) {
    return this.loginLogsService.update(id, updateLoginLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginLogsService.remove(id);
  }
}

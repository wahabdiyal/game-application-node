import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserRightService } from './user_right.service';
import { CreateUserRightDto } from './dto/create-user_right.dto';
import { UpdateUserRightDto } from './dto/update-user_right.dto';

@Controller('user-right')
export class UserRightController {
  constructor(private readonly userRightService: UserRightService) {}

  @Post()
  create(@Body() createUserRightDto: CreateUserRightDto) {
    return this.userRightService.create(createUserRightDto);
  }

  @Get()
  findAll() {
    return this.userRightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRightService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserRightDto: UpdateUserRightDto) {
    return this.userRightService.update(id, updateUserRightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRightService.remove(id);
  }
}

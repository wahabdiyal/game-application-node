import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserMenusService } from './user_menus.service';
import { CreateUserMenuDto } from './dto/create-user_menu.dto';
import { UpdateUserMenuDto } from './dto/update-user_menu.dto';

@Controller('user-menus')
export class UserMenusController {
  constructor(private readonly userMenusService: UserMenusService) {}

  @Post()
  create(@Body() createUserMenuDto: CreateUserMenuDto) {
    return this.userMenusService.create(createUserMenuDto);
  }

  @Get()
  findAll() {
    return this.userMenusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userMenusService.findOne(id);
  }
  @Get('role/:id')
  findByRole(@Param('id') id: string) {
    return this.userMenusService.findByRole(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserMenuDto: UpdateUserMenuDto,
  ) {
    return this.userMenusService.update(id, updateUserMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userMenusService.remove(id);
  }
}

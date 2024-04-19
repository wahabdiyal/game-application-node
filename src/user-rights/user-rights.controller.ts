import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserRightsService } from './user-rights.service';
import { CreateUserRightDto } from './dto/create-user-right.dto';
import { UpdateUserRightDto } from './dto/update-user-right.dto';

@Controller('user-rights')
export class UserRightsController {
  constructor(private readonly userRightsService: UserRightsService) {}
  @Post()
  create(@Body() createUserRightDto: CreateUserRightDto) {
    return this.userRightsService.create(createUserRightDto);
  }

  @Get()
  findAll() {
    return this.userRightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRightsService.findOne(id);
  }
  @Get('role/:id')
  findByRole(@Param('id') id: string) {
    return this.userRightsService.findByRole(id);
  }

  @Get('find-access/roles')
  findByRoleByController(@Query() { controller, role }) {
    return this.userRightsService.findByRoleByController(controller, role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserRightDto: UpdateUserRightDto,
  ) {
    return this.userRightsService.update(id, updateUserRightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRightsService.remove(id);
  }
}

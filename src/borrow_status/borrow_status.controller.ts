import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BorrowStatusService } from './borrow_status.service';
import { CreateBorrowStatusDto } from './dto/create-borrow_status.dto';
import { UpdateBorrowStatusDto } from './dto/update-borrow_status.dto';

@Controller('borrow-status')
export class BorrowStatusController {
  constructor(private readonly borrowStatusService: BorrowStatusService) {}

  @Post()
  create(@Body() createBorrowStatusDto: CreateBorrowStatusDto) {
    return this.borrowStatusService.create(createBorrowStatusDto);
  }

  @Get()
  findAll() {
    return this.borrowStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowStatusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowStatusDto: UpdateBorrowStatusDto) {
    return this.borrowStatusService.update(id, updateBorrowStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowStatusService.remove(id);
  }
}

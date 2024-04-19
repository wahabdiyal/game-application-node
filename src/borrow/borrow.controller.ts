import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('borrow')
// @UseGuards(AuthGuard)
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  create(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.create(createBorrowDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query() { page, perpage, start_date, end_date, search },
  ) {
    let date =
      start_date && end_date ? [{ start: start_date, end: end_date }] : [];
    return this.borrowService.findAll(
      page,
      perpage,
      date,
      search,
      req.user.role,
      req.user.country,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.borrowService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowDto: UpdateBorrowDto) {
    return this.borrowService.update(id, updateBorrowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowService.remove(id);
  }
  @Post('/reverse/:id')
  reverseBorrowByAdmin(@Param('id') id: string) {
    return this.borrowService.reverseBorrow(id);
  }

  @Get('/sender/:id')
  borrowReqeustBySender(@Param('id') id: string) {
    return this.borrowService.borrowReqeustBySender(id);
  }

  @Get('/receiver/:id')
  borrowReqeustByReceive(@Param('id') id: string) {
    return this.borrowService.borrowReqeustByReceive(id);
  }
}

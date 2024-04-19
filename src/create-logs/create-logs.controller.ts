import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateLogsService } from './create-logs.service';
import { CreateCreateLogDto } from './dto/create-create-log.dto';
import { UpdateCreateLogDto } from './dto/update-create-log.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('create-logs')
@UseGuards(AuthGuard)
export class CreateLogsController {
  constructor(private readonly createLogsService: CreateLogsService) {}

  @Post()
  create(@Body() createCountryDto: CreateCreateLogDto) {
    return this.createLogsService.create(createCountryDto);
  }

  @Get('/')
  async getUser(
    @Request() req,
    @Query() { page, perpage, search, start_date, end_date, countryName },
  ) {
    let date =
      start_date && end_date ? [{ start: start_date, end: end_date }] : [];
    return this.createLogsService.findAll(
      page,
      perpage,
      date,
      search,
      countryName,
      req.user.role,
      req.user.country,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createLogsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCreateLogDto,
  ) {
    return this.createLogsService.update(id, updateCountryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.createLogsService.remove(id);
  }

  @Get('operator/verify-hour-events/:id') // The endpoint for updating play status
  verifyOperatorsHourEvents(@Param('id') id: any) {
    return this.createLogsService.verifyOperatorsHourEvents(id);
  }
}

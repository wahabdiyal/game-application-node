import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReferralCodesService } from './referral_codes.service';
import { CreateReferralCodeDto } from './dto/create-referral_code.dto';
import { UpdateReferralCodeDto } from './dto/update-referral_code.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('referral-codes')
export class ReferralCodesController {
  constructor(private readonly referralCodesService: ReferralCodesService) {}

  @Post()
  create(@Body() createReferralCodeDto: CreateReferralCodeDto) {
    return this.referralCodesService.create(createReferralCodeDto);
  }

  @Get()
  findAll() {
    return this.referralCodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referralCodesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReferralCodeDto: UpdateReferralCodeDto,
  ) {
    return this.referralCodesService.update(+id, updateReferralCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referralCodesService.remove(+id);
  }
  @Post('user_share')
  userShare(@Req() req) {
    const referral_sharable_code = this.referralCodesService.user_share(
      req.user,
    );
    return referral_sharable_code;

    ////////// add mobile api for create user share able link///////////
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  findAll() {
    return this.challengesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateChallengeDto: UpdateChallengeDto) {
    return this.challengesService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengesService.remove(id);
  }

  @Post('remove_expire_challenges') // Remove the leading slash "/"
  removeExpireChallenges() {
    return this.challengesService.removeExpireChallenges();
  }

  // @Patch('remove_expire_challenges:id:mints') // Remove the leading slash "/"
  // restrictUserForChallenges(@Param('id') id: string, @Param('mints') mints: number,) {
  //   return id;
  //   //
  // }

  @Patch('remove_expire_challenges/:id/:mints') // Define route parameters as /:id/:mints
  restrictUserForChallenges(
    @Param('id') id: string,
    @Param('mints') mints: number,
  ) {
    return this.challengesService.restrictUserForChallenges(id, mints);
  }
}

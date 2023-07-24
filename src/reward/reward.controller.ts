import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.create(createRewardDto);
  }

  @Get()
  findAll() {
    return this.rewardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardService.findOne(id);
  }

  @Get('user/:id')
  findUserById(@Param('id') id: string) {
    return this.rewardService.findByUserId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardService.update(+id, updateRewardDto);
  }

  @Delete(':id')
    remove(@Param('id') id: string) {
      
      const deletedRecord = this.rewardService.remove(id);
    if (!deletedRecord) {
      throw new NotFoundException(`Record with ID: ${id} not found`);
    }
    return { message: 'Record deleted successfully', deletedRecord };
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyRewardDto } from './create-daily_reward.dto';

export class UpdateDailyRewardDto extends PartialType(CreateDailyRewardDto) {}

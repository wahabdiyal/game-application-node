import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyRewardCollectDto } from './create-daily_reward_collect.dto';

export class UpdateDailyRewardCollectDto extends PartialType(CreateDailyRewardCollectDto) {}

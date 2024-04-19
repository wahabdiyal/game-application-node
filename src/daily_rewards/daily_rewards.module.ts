import { Module } from '@nestjs/common';
import { DailyRewardsService } from './daily_rewards.service';
import { DailyRewardsController } from './daily_rewards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyRewardSchema } from './schemas/daily-rewards.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DailyReward', schema: DailyRewardSchema },
    ]),
  ],
  controllers: [DailyRewardsController],
  providers: [DailyRewardsService],
  exports: [DailyRewardsService],
})
export class DailyRewardsModule {}

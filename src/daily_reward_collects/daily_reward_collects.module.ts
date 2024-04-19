import { Module } from '@nestjs/common';
import { DailyRewardCollectsService } from './daily_reward_collects.service';
import { DailyRewardCollectsController } from './daily_reward_collects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyRewardCollectsSchema } from './schemas/daily_reward_collects.schema';
import { UserModule } from 'src/user/user.module';
import { DailyRewardsModule } from 'src/daily_rewards/daily_rewards.module';
import { SilversModule } from 'src/silvers/silvers.module';
import { GoldsModule } from 'src/golds/golds.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DailyRewardCollects', schema: DailyRewardCollectsSchema },
    ]),
    UserModule,
    DailyRewardsModule,
    SilversModule,
    GoldsModule,
  ],
  controllers: [DailyRewardCollectsController],
  providers: [DailyRewardCollectsService],
  exports: [DailyRewardCollectsService],
})
export class DailyRewardCollectsModule {}

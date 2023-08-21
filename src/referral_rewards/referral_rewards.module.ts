import { Module } from '@nestjs/common';
import { ReferralRewardsService } from './referral_rewards.service';
import { ReferralRewardsController } from './referral_rewards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralRewardSchema } from './schemas/referral_reward.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'ReferralReward', schema: ReferralRewardSchema }])],
  controllers: [ReferralRewardsController],
  providers: [ReferralRewardsService],
  exports: [ReferralRewardsService]
})
export class ReferralRewardsModule {}

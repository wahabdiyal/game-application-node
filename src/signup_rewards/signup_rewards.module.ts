import { Module, forwardRef } from '@nestjs/common';
import { SignupRewardsService } from './signup_rewards.service';
import { SignupRewardsController } from './signup_rewards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SignupRewardSchema } from './schemas/signup-rewards.schema';
import { AdminAccountsModule } from 'src/admin_accounts/admin_accounts.module';
 

@Module({
  imports:[MongooseModule.forFeature([{ name: 'SignupReward', schema: SignupRewardSchema }])],
  controllers: [SignupRewardsController],
  providers: [SignupRewardsService],
  exports: [SignupRewardsService]
})
export class SignupRewardsModule {}

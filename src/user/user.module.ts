import { Module,Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SignupRewardsModule } from 'src/signup_rewards/signup_rewards.module';
import { ReferralCodesModule } from 'src/referral_codes/referral_codes.module';
import { ReferralRewardsModule } from 'src/referral_rewards/referral_rewards.module';
import { GoldsModule } from 'src/golds/golds.module';
import { GoldsService } from 'src/golds/golds.service';
import { CoinTrasModule } from 'src/coin_tras/coin_tras.module';
 
 
@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    SignupRewardsModule,
    ReferralCodesModule,
    ReferralRewardsModule,
    CoinTrasModule,
  ],
    controllers: [UserController ],
    providers: [UserService, ],
    exports: [UserService],
  })
  export class UserModule {}

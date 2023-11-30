import { Module,Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SignupRewardsModule } from 'src/signup_rewards/signup_rewards.module';
import { ReferralCodesModule } from 'src/referral_codes/referral_codes.module';
import { ReferralRewardsModule } from 'src/referral_rewards/referral_rewards.module';
import { CoinTrasModule } from 'src/coin_tras/coin_tras.module';
 import { HttpModule } from '@nestjs/axios/dist';
import { LoginLogsService } from 'src/login_logs/login_logs.service';
import { LoginLogsModule } from 'src/login_logs/login_logs.module';
import { NotificationService } from 'src/gerenal-notification/notification.service';
 
@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    SignupRewardsModule,
    ReferralCodesModule,
    ReferralRewardsModule,
    CoinTrasModule,
    LoginLogsModule,
    HttpModule,
  ],
    controllers: [UserController ],
    providers: [UserService,NotificationService ],
    exports: [UserService],
  })
  export class UserModule {}

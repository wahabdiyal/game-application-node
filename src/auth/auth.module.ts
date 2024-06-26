import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { SignupRewardsModule } from 'src/signup_rewards/signup_rewards.module';
import { ReferralCodesModule } from 'src/referral_codes/referral_codes.module';
import { ReferralRewardsModule } from 'src/referral_rewards/referral_rewards.module';
import { CoinTrasModule } from 'src/coin_tras/coin_tras.module';
import { HttpModule } from '@nestjs/axios/dist';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AllowedIpsModule } from 'src/allowed_ips/allowed_ips.module';
import { LoginLogsService } from '../login_logs/login_logs.service'; // Corrected import path
import { LoginLogsModule } from 'src/login_logs/login_logs.module';
import { NotificationService } from 'src/gerenal-notification/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    SignupRewardsModule,
    ReferralCodesModule,
    ReferralRewardsModule,
    CoinTrasModule,
    HttpModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      global: true,
      secret:
        'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
      signOptions: { expiresIn: '7d' },
    }),
    AllowedIpsModule,
    LoginLogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, NotificationService], // Include LoginLogsService here
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}

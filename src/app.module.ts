import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RewardModule } from './reward/reward.module';
import { GoldsModule } from './golds/golds.module';
import { SilversModule } from './silvers/silvers.module';
import { UserService } from './user/user.service';
import { CoinUserModule } from './coin_user/coin_user.module';
import { WithdrawModule } from './withdraw/withdraw.module';

import { UserRightModule } from './user_right/user_right.module';
import { ContactModule } from './contact/contact.module';
import { User, UserSchema } from './user/schemas/user.schema';
import { CountriesModule } from './countries/countries.module';
import { SignupRewardsModule } from './signup_rewards/signup_rewards.module';
import { ReferralRewardsModule } from './referral_rewards/referral_rewards.module';
import { ReferralCodesModule } from './referral_codes/referral_codes.module';
import { BannersModule } from './banners/banners.module';
import { BannerCollectionsModule } from './banner_collections/banner_collections.module';
import { CoinTrasModule } from './coin_tras/coin_tras.module';
import { GamesModule } from './games/games.module';
import { DailyRewardsModule } from './daily_rewards/daily_rewards.module';
import { DailyRewardCollectsModule } from './daily_reward_collects/daily_reward_collects.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ContactsModule } from './contacts/contacts.module';
import { UserBanksModule } from './user_banks/user_banks.module';
import { AdminBankModule } from './admin_bank/admin_bank.module';
import { CryptoWalletsModule } from './crypto_wallets/crypto_wallets.module';
import { CurrencyModule } from './currency/currency.module';
import { UserCryptoWalletsModule } from './user_crypto_wallets/user_crypto_wallets.module';
import { AdminAccountsModule } from './admin_accounts/admin_accounts.module';
import { BankCryptoModule } from './bank_crypto/bank_crypto.module';
import { WithdrawLimitsModule } from './withdraw_limits/withdraw_limits.module';
import { PackagesModule } from './packages/packages.module'; 
import { ChallengesModule } from './challenges/challenges.module'; 
import { AllowedIpsModule } from './allowed_ips/allowed_ips.module';
import { BorrowModule } from './borrow/borrow.module';
import { BorrowStatusModule } from './borrow_status/borrow_status.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
 

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    RewardModule,
    GoldsModule,
    SilversModule,
    CoinUserModule,
    WithdrawModule,
    UserRightModule,
    ContactModule,
    CountriesModule,
    SignupRewardsModule,
    ReferralRewardsModule,
    ReferralCodesModule,
    BannersModule,
    BannerCollectionsModule,
    CoinTrasModule,
    GamesModule,
    DailyRewardsModule,
    DailyRewardCollectsModule,
    ContactsModule,
    UserBanksModule,
    AdminBankModule,
    CryptoWalletsModule,
    CurrencyModule,
    UserCryptoWalletsModule,
    AdminAccountsModule,
    BankCryptoModule,
    WithdrawLimitsModule,
    PackagesModule,
    AllowedIpsModule,
    ChallengesModule,
    BorrowModule,
    BorrowStatusModule,
 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('auth/login/admin');
  }
}

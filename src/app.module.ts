import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RewardModule } from './reward/reward.module';
import { GoldsModule } from './golds/golds.module';
import { SilversModule } from './silvers/silvers.module';
// import { UserService } from './user/user.service';
import { CoinUserModule } from './coin_user/coin_user.module';
import { WithdrawModule } from './withdraw/withdraw.module';

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
// import * as AutoIncrementFactory from 'mongoose-sequence';
// import { Connection } from 'mongoose';

import { PurchaseRequestsModule } from './purchase_requests/purchase_requests.module';

import { RechargeAdminWalletsModule } from './recharge-admin-wallets/recharge-admin-wallets.module';

import { LoginLogsModule } from './login_logs/login_logs.module';

import { BetsModule } from './bets/bets.module';

import { UserMenusModule } from './user_menus/user_menus.module';
import { CreateLogsModule } from './create-logs/create-logs.module';
import { UserRightsModule } from './user-rights/user-rights.module';
import { CryptoValuesModule } from './crypto-values/crypto-values.module';
import { RoomModule } from './room/room.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DB_CONNECTION, {
      // connectionFactory: (connection) => {
      //   connection.plugin(require('mongoose-autopopulate'));
      //   return connection;
      // }
    }),
    // MongooseModule.forFeatureAsync([
    //   {
    //     name: User.name,
    //     useFactory: async (connection: Connection) => {
    //       const schema = UserSchema;
    //       const AutoIncrement = AutoIncrementFactory(connection);
    //       schema.plugin(AutoIncrement, {inc_field: 'userId'});
    //       return schema;
    //     },
    //      inject: [getConnectionToken()],
    //   },
    // ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    RewardModule,
    GoldsModule,
    SilversModule,
    CoinUserModule,
    WithdrawModule,
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
    BetsModule,
    PurchaseRequestsModule,

    RechargeAdminWalletsModule,
    LoginLogsModule,
    BetsModule,
    UserMenusModule,
    CreateLogsModule,
    UserRightsModule,
    CryptoValuesModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  ///////middleware which proccess without token /////////////
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        'auth/login',
        'auth/phone/otp',
        'auth/google/token',
        'auth/login/admin',
        'auth/login/phone',
        'auth/forgot-password/:phone_no',
        'auth/update-password',
      )
      .forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
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
import { GameModule } from './game/game.module';
import { UserRightModule } from './user_right/user_right.module';
import { ContactModule } from './contact/contact.module';
import { User, UserSchema } from './user/schemas/user.schema';
import { CountriesModule } from './countries/countries.module';
 
 
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
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
    UserModule,
    AuthModule,
    RewardModule,
     GoldsModule,
     SilversModule,
     CoinUserModule,
     WithdrawModule,
     GameModule,
     UserRightModule,
     ContactModule,
     CountriesModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

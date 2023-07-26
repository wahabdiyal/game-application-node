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
 
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal: true,
    }),
     
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    UserModule,
    AuthModule,
   
    RewardModule,
   
    // GoldsModule,
   
     SilversModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

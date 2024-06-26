import { Module } from '@nestjs/common';
import { SilversService } from './silvers.service';
import { SilversController } from './silvers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SilverSchema } from './schemas/silver_coin.schema';
import { UserModule } from 'src/user/user.module';
import { UserSilverController } from './userSilver.controller';
import { GoldsModule } from 'src/golds/golds.module';

@Module({
  ///////important note schema class in string and name of variable in schema export class name here....
  imports: [
    MongooseModule.forFeature([{ name: 'Silver', schema: SilverSchema }]),
    UserModule,
    GoldsModule,
  ],
  controllers: [SilversController, UserSilverController],
  providers: [SilversService],
  exports: [SilversService],
})
export class SilversModule {}

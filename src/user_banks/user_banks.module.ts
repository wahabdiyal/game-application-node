import { Module } from '@nestjs/common';
import { UserBanksService } from './user_banks.service';
import { UserBanksController } from './user_banks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserBankSchema } from './schemas/user_banks.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'UserBank', schema: UserBankSchema }]) ],
  controllers: [UserBanksController],
  providers: [UserBanksService],
  exports: [UserBanksService],
})
export class UserBanksModule {}

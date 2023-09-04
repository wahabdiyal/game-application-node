import { Module } from '@nestjs/common';
import { AdminBankService } from './admin_bank.service';
import { AdminBankController } from './admin_bank.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminBankSchema } from './schemas/admin_bank.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'AdminBank', schema: AdminBankSchema }]) ],
  controllers: [AdminBankController],
  providers: [AdminBankService],
})
export class AdminBankModule {}

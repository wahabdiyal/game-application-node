import { Module } from '@nestjs/common';
import { WithdrawLimitsService } from './withdraw_limits.service';
import { WithdrawLimitsController } from './withdraw_limits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Withdraw_limitsSchema } from './schmas/withdraw_limits.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Withdraw_limits', schema: Withdraw_limitsSchema },
    ]),
  ],
  controllers: [WithdrawLimitsController],
  providers: [WithdrawLimitsService],
  exports: [WithdrawLimitsService],
})
export class WithdrawLimitsModule {}

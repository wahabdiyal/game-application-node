import { Module } from '@nestjs/common';
import { ReferralCodesService } from './referral_codes.service';
import { ReferralCodesController } from './referral_codes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralCodeSchema } from './schemas/referral_code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ReferralCode', schema: ReferralCodeSchema },
    ]),
  ],
  controllers: [ReferralCodesController],
  providers: [ReferralCodesService],
  exports: [ReferralCodesService],
})
export class ReferralCodesModule {}

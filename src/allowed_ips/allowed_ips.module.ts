import { Module } from '@nestjs/common';
import { AllowedIpsService } from './allowed_ips.service';
import { AllowedIpsController } from './allowed_ips.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AllowedIPSchema } from './schemas/allowed_ips.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AllowedIP', schema: AllowedIPSchema }]),
  ],
  controllers: [AllowedIpsController],
  providers: [AllowedIpsService],
  exports: [AllowedIpsService],
})
export class AllowedIpsModule {}

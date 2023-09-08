import { Module } from '@nestjs/common';
import { AllowedIpsService } from './allowed_ips.service';
import { AllowedIpsController } from './allowed_ips.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Allowed_IPsSchema } from './schemas/allowed_ips.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'AllowedIps', schema: Allowed_IPsSchema }])],
  controllers: [AllowedIpsController],
  providers: [AllowedIpsService],
  exports: [AllowedIpsService],
})
export class AllowedIpsModule { }

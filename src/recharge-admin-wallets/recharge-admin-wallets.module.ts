import { Module } from '@nestjs/common';
import { RechargeAdminWalletsService } from './recharge-admin-wallets.service';
import { RechargeAdminWalletsController } from './recharge-admin-wallets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RechargeAdminWalletsSchema } from './schemas/recharge-admin-wallets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RechargeAdminWallets', schema: RechargeAdminWalletsSchema },
    ]),
  ],
  controllers: [RechargeAdminWalletsController],
  providers: [RechargeAdminWalletsService],
})
export class RechargeAdminWalletsModule {}

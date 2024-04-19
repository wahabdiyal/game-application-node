import { Module } from '@nestjs/common';
import { PurchaseRequestsService } from './purchase_requests.service';
import { PurchaseRequestsController } from './purchase_requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseRequestsSchema } from './schemas/purchase_requests.schema';
import { AdminAccountsModule } from 'src/admin_accounts/admin_accounts.module';
import { GoldsModule } from 'src/golds/golds.module';
import { SilversModule } from 'src/silvers/silvers.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PurchaseRequests', schema: PurchaseRequestsSchema },
    ]),
    AdminAccountsModule,
    GoldsModule,
    SilversModule,
    UserModule,
  ],
  controllers: [PurchaseRequestsController],
  providers: [PurchaseRequestsService],
  exports: [PurchaseRequestsService],
})
export class PurchaseRequestsModule {}

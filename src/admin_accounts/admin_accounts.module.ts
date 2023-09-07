import { Module } from '@nestjs/common';
import { AdminAccountsService } from './admin_accounts.service';
import { AdminAccountsController } from './admin_accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminAccountSchema } from './schemas/admin_account.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"AdminAccount",schema:AdminAccountSchema}])],
  controllers: [AdminAccountsController],
  providers: [AdminAccountsService],
  exports: [AdminAccountsService],
})
export class AdminAccountsModule {}

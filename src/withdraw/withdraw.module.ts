import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { WithdrawSchema } from './schmas/withdraw.schema';
import { UserModule } from 'src/user/user.module';
import { GoldsModule } from 'src/golds/golds.module';
import { AdminAccountsModule } from 'src/admin_accounts/admin_accounts.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Withdraw', schema:WithdrawSchema  }
]) ,UserModule,GoldsModule,AdminAccountsModule ],
  controllers: [WithdrawController],
  providers: [WithdrawService],
  exports:[WithdrawService]
})
export class WithdrawModule {}

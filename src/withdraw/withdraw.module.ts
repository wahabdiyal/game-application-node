import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { WithdrawSchema } from './schmas/withdraw.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Withdraw', schema:WithdrawSchema  }
]) ,UserModule ],
  controllers: [WithdrawController],
  providers: [WithdrawService],
  exports:[WithdrawService]
})
export class WithdrawModule {}

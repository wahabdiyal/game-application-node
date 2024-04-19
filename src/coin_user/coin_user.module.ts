import { Module } from '@nestjs/common';
import { CoinUserService } from './coin_user.service';
import { CoinUserController } from './coin_user.controller';
import { UserModule } from 'src/user/user.module';
import { GoldsModule } from 'src/golds/golds.module';
import { SilversModule } from 'src/silvers/silvers.module';

@Module({
  imports: [UserModule, GoldsModule, SilversModule],
  controllers: [CoinUserController],
  providers: [CoinUserService],
})
export class CoinUserModule {}

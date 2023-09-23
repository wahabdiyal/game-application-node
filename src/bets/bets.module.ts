import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BetsSchema } from './schemas/bets.schema';
import { UserModule } from 'src/user/user.module';
import { GamesModule } from 'src/games/games.module';
import { AdminAccountsModule } from 'src/admin_accounts/admin_accounts.module';
import { GoldsModule } from 'src/golds/golds.module';

@Module({
  imports:[MongooseModule.forFeature([{name:"Bets",schema:BetsSchema}]),UserModule,GamesModule,AdminAccountsModule,GoldsModule],
  controllers: [BetsController],
  providers: [BetsService],
  exports: [BetsService],
})
export class BetsModule {}

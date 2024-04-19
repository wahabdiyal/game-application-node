import { Module } from '@nestjs/common';
import { CoinTrasService } from './coin_tras.service';

import { MongooseModule } from '@nestjs/mongoose';
import { SilverSchema } from 'src/silvers/schemas/silver_coin.schema';
import { GoldSchema } from 'src/golds/schemas/gold_coin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Silver', schema: SilverSchema },
      { name: 'Gold', schema: GoldSchema },
    ]),
  ],
  controllers: [],
  providers: [CoinTrasService],
  exports: [CoinTrasService],
})
export class CoinTrasModule {}

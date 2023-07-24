import { Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {  GoldCoinSchema } from './schemas/gold_coin.schema';
import { SiliverCoinSchema } from './schemas/silver_coin.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Gold', schema: GoldCoinSchema }]),
  MongooseModule.forFeature([{ name: 'Siliver', schema: SiliverCoinSchema }])],

  controllers: [CoinsController],
  providers: [CoinsService]
})
export class CoinsModule {}

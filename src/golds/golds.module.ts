import { Module } from '@nestjs/common';
import { GoldsService } from './golds.service';
import { GoldsController } from './golds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GoldSchema } from './schemas/gold_coin.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Gold', schema: GoldSchema }])],
  controllers: [GoldsController],
  providers: [GoldsService]
})
export class GoldsModule {}

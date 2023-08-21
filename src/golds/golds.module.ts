import { Module } from '@nestjs/common';
import { GoldsService } from './golds.service';
import { GoldsController } from './golds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GoldSchema } from './schemas/gold_coin.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Gold', schema: GoldSchema }]),UserModule],
  controllers: [GoldsController],
  providers: [GoldsService],
  exports: [GoldsService],
})
export class GoldsModule {}

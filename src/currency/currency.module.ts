import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencySchema } from './schemas/currency.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[MongooseModule.forFeature([{name:"Currency",schema:CurrencySchema}]),HttpModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}

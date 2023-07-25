import { Module } from '@nestjs/common';
import { SilversService } from './silvers.service';
import { SilversController } from './silvers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Silver } from './schemas/silver_coin.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'silver', schema: Silver }])],
  controllers: [SilversController],
  providers: [SilversService]
})
export class SilversModule {}

import { Module } from '@nestjs/common';
import { GoldsService } from './golds.service';
import { GoldsController } from './golds.controller';

@Module({
  controllers: [GoldsController],
  providers: [GoldsService]
})
export class GoldsModule {}

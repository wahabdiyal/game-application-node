import { Module } from '@nestjs/common';
import { BorrowStatusService } from './borrow_status.service';
import { BorrowStatusController } from './borrow_status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowStatusSchema } from './schemas/borrow_status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BorrowStatus', schema: BorrowStatusSchema },
    ]),
  ],
  controllers: [BorrowStatusController],
  providers: [BorrowStatusService],
  exports: [BorrowStatusService],
})
export class BorrowStatusModule {}

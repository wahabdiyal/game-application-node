import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowSchema } from './schemas/borrow.schema';
import { UserModule } from 'src/user/user.module';
import { GoldsModule } from 'src/golds/golds.module';
import { SilversModule } from 'src/silvers/silvers.module';

@Module({
  imports:[MongooseModule.forFeature([{name:"Borrow",schema:BorrowSchema}]),UserModule,GoldsModule,SilversModule],
  controllers: [BorrowController],
  providers: [BorrowService],
  exports: [BorrowService],
})
export class BorrowModule {}

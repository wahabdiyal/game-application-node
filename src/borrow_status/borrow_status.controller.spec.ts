import { Test, TestingModule } from '@nestjs/testing';
import { BorrowStatusController } from './borrow_status.controller';
import { BorrowStatusService } from './borrow_status.service';

describe('BorrowStatusController', () => {
  let controller: BorrowStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowStatusController],
      providers: [BorrowStatusService],
    }).compile();

    controller = module.get<BorrowStatusController>(BorrowStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

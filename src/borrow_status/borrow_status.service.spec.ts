import { Test, TestingModule } from '@nestjs/testing';
import { BorrowStatusService } from './borrow_status.service';

describe('BorrowStatusService', () => {
  let service: BorrowStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowStatusService],
    }).compile();

    service = module.get<BorrowStatusService>(BorrowStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

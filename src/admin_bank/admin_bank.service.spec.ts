import { Test, TestingModule } from '@nestjs/testing';
import { AdminBankService } from './admin_bank.service';

describe('AdminBankService', () => {
  let service: AdminBankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminBankService],
    }).compile();

    service = module.get<AdminBankService>(AdminBankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

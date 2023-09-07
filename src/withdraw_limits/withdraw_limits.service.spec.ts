import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawLimitsService } from './withdraw_limits.service';

describe('WithdrawLimitsService', () => {
  let service: WithdrawLimitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawLimitsService],
    }).compile();

    service = module.get<WithdrawLimitsService>(WithdrawLimitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

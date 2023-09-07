import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawLimitsController } from './withdraw_limits.controller';
import { WithdrawLimitsService } from './withdraw_limits.service';

describe('WithdrawLimitsController', () => {
  let controller: WithdrawLimitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawLimitsController],
      providers: [WithdrawLimitsService],
    }).compile();

    controller = module.get<WithdrawLimitsController>(WithdrawLimitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DailyRewardCollectsController } from './daily_reward_collects.controller';
import { DailyRewardCollectsService } from './daily_reward_collects.service';

describe('DailyRewardCollectsController', () => {
  let controller: DailyRewardCollectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyRewardCollectsController],
      providers: [DailyRewardCollectsService],
    }).compile();

    controller = module.get<DailyRewardCollectsController>(DailyRewardCollectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DailyRewardCollectsService } from './daily_reward_collects.service';

describe('DailyRewardCollectsService', () => {
  let service: DailyRewardCollectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyRewardCollectsService],
    }).compile();

    service = module.get<DailyRewardCollectsService>(DailyRewardCollectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

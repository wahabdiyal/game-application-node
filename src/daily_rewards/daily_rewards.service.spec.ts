import { Test, TestingModule } from '@nestjs/testing';
import { DailyRewardsService } from './daily_rewards.service';

describe('DailyRewardsService', () => {
  let service: DailyRewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyRewardsService],
    }).compile();

    service = module.get<DailyRewardsService>(DailyRewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DailyRewardsController } from './daily_rewards.controller';
import { DailyRewardsService } from './daily_rewards.service';

describe('DailyRewardsController', () => {
  let controller: DailyRewardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyRewardsController],
      providers: [DailyRewardsService],
    }).compile();

    controller = module.get<DailyRewardsController>(DailyRewardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

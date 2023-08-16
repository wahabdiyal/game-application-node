import { Test, TestingModule } from '@nestjs/testing';
import { ReferralRewardsService } from './referral_rewards.service';

describe('ReferralRewardsService', () => {
  let service: ReferralRewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferralRewardsService],
    }).compile();

    service = module.get<ReferralRewardsService>(ReferralRewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ReferralRewardsController } from './referral_rewards.controller';
import { ReferralRewardsService } from './referral_rewards.service';

describe('ReferralRewardsController', () => {
  let controller: ReferralRewardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralRewardsController],
      providers: [ReferralRewardsService],
    }).compile();

    controller = module.get<ReferralRewardsController>(
      ReferralRewardsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SignupRewardsService } from './signup_rewards.service';

describe('SignupRewardsService', () => {
  let service: SignupRewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignupRewardsService],
    }).compile();

    service = module.get<SignupRewardsService>(SignupRewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

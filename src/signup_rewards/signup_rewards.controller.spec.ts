import { Test, TestingModule } from '@nestjs/testing';
import { SignupRewardsController } from './signup_rewards.controller';
import { SignupRewardsService } from './signup_rewards.service';

describe('SignupRewardsController', () => {
  let controller: SignupRewardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupRewardsController],
      providers: [SignupRewardsService],
    }).compile();

    controller = module.get<SignupRewardsController>(SignupRewardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

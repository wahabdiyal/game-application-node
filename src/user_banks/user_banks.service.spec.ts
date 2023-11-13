import { Test, TestingModule } from '@nestjs/testing';
import { UserBanksService } from './user_banks.service';

describe('UserBanksService', () => {
  let service: UserBanksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBanksService],
    }).compile();

    service = module.get<UserBanksService>(UserBanksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

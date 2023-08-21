import { Test, TestingModule } from '@nestjs/testing';
import { CoinUserService } from './coin_user.service';

describe('CoinUserService', () => {
  let service: CoinUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinUserService],
    }).compile();

    service = module.get<CoinUserService>(CoinUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

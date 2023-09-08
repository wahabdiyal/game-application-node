import { Test, TestingModule } from '@nestjs/testing';
import { UserCryptoWalletsService } from './user_crypto_wallets.service';

describe('UserCryptoWalletsService', () => {
  let service: UserCryptoWalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCryptoWalletsService],
    }).compile();

    service = module.get<UserCryptoWalletsService>(UserCryptoWalletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

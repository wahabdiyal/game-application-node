import { Test, TestingModule } from '@nestjs/testing';
import { UserCryptoWalletsController } from './user_crypto_wallets.controller';
import { UserCryptoWalletsService } from './user_crypto_wallets.service';

describe('UserCryptoWalletsController', () => {
  let controller: UserCryptoWalletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCryptoWalletsController],
      providers: [UserCryptoWalletsService],
    }).compile();

    controller = module.get<UserCryptoWalletsController>(
      UserCryptoWalletsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

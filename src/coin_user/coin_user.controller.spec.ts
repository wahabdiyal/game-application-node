import { Test, TestingModule } from '@nestjs/testing';
import { CoinUserController } from './coin_user.controller';
import { CoinUserService } from './coin_user.service';

describe('CoinUserController', () => {
  let controller: CoinUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoinUserController],
      providers: [CoinUserService],
    }).compile();

    controller = module.get<CoinUserController>(CoinUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

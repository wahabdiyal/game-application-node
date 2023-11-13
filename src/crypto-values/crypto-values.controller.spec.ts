import { Test, TestingModule } from '@nestjs/testing';
import { CryptoValuesController } from './crypto-values.controller';
import { CryptoValuesService } from './crypto-values.service';

describe('CryptoValuesController', () => {
  let controller: CryptoValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoValuesController],
      providers: [CryptoValuesService],
    }).compile();

    controller = module.get<CryptoValuesController>(CryptoValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

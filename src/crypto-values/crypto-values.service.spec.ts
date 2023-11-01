import { Test, TestingModule } from '@nestjs/testing';
import { CryptoValuesService } from './crypto-values.service';

describe('CryptoValuesService', () => {
  let service: CryptoValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoValuesService],
    }).compile();

    service = module.get<CryptoValuesService>(CryptoValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SilversService } from './silvers.service';

describe('SilversService', () => {
  let service: SilversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SilversService],
    }).compile();

    service = module.get<SilversService>(SilversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

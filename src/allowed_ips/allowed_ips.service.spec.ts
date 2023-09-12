import { Test, TestingModule } from '@nestjs/testing';
import { AllowedIpsService } from './allowed_ips.service';

describe('AllowedIpsService', () => {
  let service: AllowedIpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllowedIpsService],
    }).compile();

    service = module.get<AllowedIpsService>(AllowedIpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

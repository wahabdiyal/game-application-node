import { Test, TestingModule } from '@nestjs/testing';
import { ReferralCodesService } from './referral_codes.service';

describe('ReferralCodesService', () => {
  let service: ReferralCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferralCodesService],
    }).compile();

    service = module.get<ReferralCodesService>(ReferralCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

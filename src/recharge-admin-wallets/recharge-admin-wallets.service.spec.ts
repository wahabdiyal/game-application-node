import { Test, TestingModule } from '@nestjs/testing';
import { RechargeAdminWalletsService } from './recharge-admin-wallets.service';

describe('RechargeAdminWalletsService', () => {
  let service: RechargeAdminWalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RechargeAdminWalletsService],
    }).compile();

    service = module.get<RechargeAdminWalletsService>(
      RechargeAdminWalletsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

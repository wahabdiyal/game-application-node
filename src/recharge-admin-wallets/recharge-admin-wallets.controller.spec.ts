import { Test, TestingModule } from '@nestjs/testing';
import { RechargeAdminWalletsController } from './recharge-admin-wallets.controller';
import { RechargeAdminWalletsService } from './recharge-admin-wallets.service';

describe('RechargeAdminWalletsController', () => {
  let controller: RechargeAdminWalletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RechargeAdminWalletsController],
      providers: [RechargeAdminWalletsService],
    }).compile();

    controller = module.get<RechargeAdminWalletsController>(RechargeAdminWalletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

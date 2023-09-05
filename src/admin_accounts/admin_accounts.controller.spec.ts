import { Test, TestingModule } from '@nestjs/testing';
import { AdminAccountsController } from './admin_accounts.controller';
import { AdminAccountsService } from './admin_accounts.service';

describe('AdminAccountsController', () => {
  let controller: AdminAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAccountsController],
      providers: [AdminAccountsService],
    }).compile();

    controller = module.get<AdminAccountsController>(AdminAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

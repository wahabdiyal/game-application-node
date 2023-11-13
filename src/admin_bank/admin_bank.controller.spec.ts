import { Test, TestingModule } from '@nestjs/testing';
import { AdminBankController } from './admin_bank.controller';
import { AdminBankService } from './admin_bank.service';

describe('AdminBankController', () => {
  let controller: AdminBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBankController],
      providers: [AdminBankService],
    }).compile();

    controller = module.get<AdminBankController>(AdminBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

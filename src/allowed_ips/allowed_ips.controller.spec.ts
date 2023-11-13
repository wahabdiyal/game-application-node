import { Test, TestingModule } from '@nestjs/testing';
import { AllowedIpsController } from './allowed_ips.controller';
import { AllowedIpsService } from './allowed_ips.service';

describe('AllowedIpsController', () => {
  let controller: AllowedIpsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllowedIpsController],
      providers: [AllowedIpsService],
    }).compile();

    controller = module.get<AllowedIpsController>(AllowedIpsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SilversController } from './silvers.controller';
import { SilversService } from './silvers.service';

describe('SilversController', () => {
  let controller: SilversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SilversController],
      providers: [SilversService],
    }).compile();

    controller = module.get<SilversController>(SilversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

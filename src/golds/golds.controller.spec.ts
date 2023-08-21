import { Test, TestingModule } from '@nestjs/testing';
import { GoldsController } from './golds.controller';
import { GoldsService } from './golds.service';

describe('GoldsController', () => {
  let controller: GoldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoldsController],
      providers: [GoldsService],
    }).compile();

    controller = module.get<GoldsController>(GoldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CreateLogsController } from './create-logs.controller';
import { CreateLogsService } from './create-logs.service';

describe('CreateLogsController', () => {
  let controller: CreateLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateLogsController],
      providers: [CreateLogsService],
    }).compile();

    controller = module.get<CreateLogsController>(CreateLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

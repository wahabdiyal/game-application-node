import { Test, TestingModule } from '@nestjs/testing';
import { CreateLogsService } from './create-logs.service';

describe('CreateLogsService', () => {
  let service: CreateLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateLogsService],
    }).compile();

    service = module.get<CreateLogsService>(CreateLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

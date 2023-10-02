import { Test, TestingModule } from '@nestjs/testing';
import { UserRightsService } from './user-rights.service';

describe('UserRightsService', () => {
  let service: UserRightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRightsService],
    }).compile();

    service = module.get<UserRightsService>(UserRightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

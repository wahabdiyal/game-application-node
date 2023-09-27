import { Test, TestingModule } from '@nestjs/testing';
import { UserMenusService } from './user_menus.service';

describe('UserMenusService', () => {
  let service: UserMenusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMenusService],
    }).compile();

    service = module.get<UserMenusService>(UserMenusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

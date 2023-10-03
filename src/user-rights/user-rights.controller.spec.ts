import { Test, TestingModule } from '@nestjs/testing';
import { UserRightsController } from './user-rights.controller';
import { UserRightsService } from './user-rights.service';

describe('UserRightsController', () => {
  let controller: UserRightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRightsController],
      providers: [UserRightsService],
    }).compile();

    controller = module.get<UserRightsController>(UserRightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

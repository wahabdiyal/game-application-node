import { Test, TestingModule } from '@nestjs/testing';
import { UserMenusController } from './user_menus.controller';
import { UserMenusService } from './user_menus.service';

describe('UserMenusController', () => {
  let controller: UserMenusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMenusController],
      providers: [UserMenusService],
    }).compile();

    controller = module.get<UserMenusController>(UserMenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

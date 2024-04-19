import { Test, TestingModule } from '@nestjs/testing';
import { BannerCollectionsController } from './banner_collections.controller';
import { BannerCollectionsService } from './banner_collections.service';

describe('BannerCollectionsController', () => {
  let controller: BannerCollectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannerCollectionsController],
      providers: [BannerCollectionsService],
    }).compile();

    controller = module.get<BannerCollectionsController>(
      BannerCollectionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

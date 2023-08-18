import { Test, TestingModule } from '@nestjs/testing';
import { BannerCollectionsService } from './banner_collections.service';

describe('BannerCollectionsService', () => {
  let service: BannerCollectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BannerCollectionsService],
    }).compile();

    service = module.get<BannerCollectionsService>(BannerCollectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

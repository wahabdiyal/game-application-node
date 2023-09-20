import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRequestsService } from './purchase_requests.service';

describe('PurchaseRequestsService', () => {
  let service: PurchaseRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseRequestsService],
    }).compile();

    service = module.get<PurchaseRequestsService>(PurchaseRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

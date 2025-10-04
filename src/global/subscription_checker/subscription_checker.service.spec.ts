import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionCheckerService } from './subscription_checker.service';

describe('SubscriptionCheckerService', () => {
  let service: SubscriptionCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionCheckerService],
    }).compile();

    service = module.get<SubscriptionCheckerService>(SubscriptionCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

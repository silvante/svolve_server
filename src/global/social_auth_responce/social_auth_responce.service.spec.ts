import { Test, TestingModule } from '@nestjs/testing';
import { SocialAuthResponceService } from './social_auth_responce.service';

describe('SocialAuthResponceService', () => {
  let service: SocialAuthResponceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialAuthResponceService],
    }).compile();

    service = module.get<SocialAuthResponceService>(SocialAuthResponceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

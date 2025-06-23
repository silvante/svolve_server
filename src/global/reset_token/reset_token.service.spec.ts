import { Test, TestingModule } from '@nestjs/testing';
import { ResetTokenService } from './reset_token.service';

describe('ResetTokenService', () => {
  let service: ResetTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetTokenService],
    }).compile();

    service = module.get<ResetTokenService>(ResetTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

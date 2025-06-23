import { Test, TestingModule } from '@nestjs/testing';
import { VerifyMailService } from './verify_mail.service';

describe('VerifyMailService', () => {
  let service: VerifyMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyMailService],
    }).compile();

    service = module.get<VerifyMailService>(VerifyMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MagicLinkGeneratorService } from './magic_link_generator.service';

describe('MagicLinkGeneratorService', () => {
  let service: MagicLinkGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagicLinkGeneratorService],
    }).compile();

    service = module.get<MagicLinkGeneratorService>(MagicLinkGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

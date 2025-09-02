import { Controller } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('organizations/:org_id/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
}

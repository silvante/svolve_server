import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { OrganizationAccessGuard } from 'src/guards/organization-access/organization-access.guard';
import { OwnerAccessGuard } from 'src/guards/owner-access/owner-access.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('organizations/:org_id/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(AuthGuard, OrganizationAccessGuard, OwnerAccessGuard)
  @Get('/clients')
  getClientsStats(@Req() req: RequestWithUser) {
    return this.statsService.getClientsStats(req);
  }
  @UseGuards(AuthGuard, OrganizationAccessGuard, OwnerAccessGuard)
  @Get('/revenue')
  getRevenueStats(@Req() req: RequestWithUser) {
    return this.statsService.getRevenueStats(req);
  }
}

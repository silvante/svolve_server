import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { OrganizationAccessGuard } from 'src/guards/organization-access/organization-access.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { OwnerAccessGuard } from 'src/guards/owner-access/owner-access.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard, OrganizationAccessGuard, OwnerAccessGuard)
  @Get(':unique_name/checkout')
  generateCheckout(@Req() req: RequestWithUser) {
    return this.subscriptionService.generateCheckout(req);
  }

  @Post('webhook')
  madeLemonade(@Req() req: Request, @Res() res: Response) {}
}

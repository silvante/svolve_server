import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Request, Response } from 'express';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard)
  @Get(':unique_name/checkout')
  generateCheckout(
    @Req() req: RequestWithUser,
    @Param('unique_name') unique_name: string,
  ) {
    return this.subscriptionService.generateCheckout(req, unique_name);
  }

  @Post('webhook')
  madeLemonade(@Req() req: Request, @Res() res: Response) {
    return this.subscriptionService.Webhook(req, res);
  }
}

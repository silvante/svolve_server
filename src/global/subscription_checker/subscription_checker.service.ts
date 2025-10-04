import { Injectable } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { isAfter, isBefore } from 'date-fns';

@Injectable()
export class SubscriptionCheckerService {
  track(org: Organization) {
    if (org.is_vip) {
      return true;
    }

    const now = new Date();

    return (
      org.subscription_status === 'active' &&
      isBefore(org.subscribed_at, now) &&
      isAfter(org.renews_at, now)
    );
  }
}

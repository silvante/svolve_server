import { HttpException, Injectable } from '@nestjs/common';
import { isAfter, isBefore } from 'date-fns';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async generateCheckout(req: RequestWithUser, unique_name: string) {
    const user = req.user;
    const org = await this.prisma.organization.findUnique({
      where: { unique_name, owner_id: user.id },
    });

    if (!org) {
      throw new HttpException('Organization not found', 404);
    }

    // subscription cheking
    const now = new Date();

    const is_subscribed =
      org.subscription_status === 'active' &&
      isBefore(org.subscribed_at, now) &&
      isAfter(org.renews_at, now);

    if (is_subscribed) {
      return {
        subscription: true,
        organization: org,
        url: null,
        is_vip: org.is_vip,
      };
    }

    const url: string = String(process.env.PAYMENT_URL);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: user.email,
              custom: {
                organization_id: String(org.id),
              },
            },
          },
          relationships: {
            store: {
              data: { type: 'stores', id: process.env.PAYMENT_STORE_ID },
            },
            variant: {
              data: { type: 'variants', id: process.env.PAYMENT_VARIANT_ID },
            },
          },
        },
      }),
    });

    const checkout = await response.json();

    return {
      organization: org,
      subscription: false,
      url: checkout.data.attributes.url,
      is_vip: org.is_vip,
    };
  }
}

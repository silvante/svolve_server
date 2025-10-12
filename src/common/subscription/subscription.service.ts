import { HttpException, Injectable } from '@nestjs/common';
import { isAfter, isBefore } from 'date-fns';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';

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
    };
  }

  async Webhook(req: Request, res: Response) {
    const event = req.body;

    switch (event.meta.event_name) {
      case 'subscription_created':
        const org_id = Number(event.meta.custom_data.organization_id);
        if (!org_id) throw new HttpException('No organization Found', 404);
        await this.prisma.organization.update({
          where: { id: org_id },
          data: {
            subscribed_at: new Date(),
            renews_at: event.data.attributes.renews_at,
          },
        });
        break;
      case 'subscription_payment_success':
        const ORG_ID = Number(event.meta.custom_data.organization_id);
        if (!ORG_ID) throw new HttpException('No organization Found', 404);
        await this.prisma.organization.update({
          where: { id: ORG_ID },
          data: {
            subscription_status: 'active',
          },
        });
        break;
      case 'subscription_expired':
        const orgId = Number(event.meta.custom_data.organization_id);
        if (!orgId) throw new HttpException('No organization Found', 404);
        await this.prisma.organization.update({
          where: { id: orgId },
          data: {
            subscription_status: 'expired',
          },
        });
        break;
    }

    return res.sendStatus(200);
  }
}

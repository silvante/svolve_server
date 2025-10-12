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
        const submition = await this.prisma.organization.update({
          where: { id: org_id },
          data: {
            subscribed_at: new Date(),
            renews_at: event.data.attributes
          },
        });
        break;
    }
    console.log(event);

    return res.sendStatus(200);
  }
}

// {
//   meta: {
//     test_mode: true,
//     event_name: 'subscription_updated',
//     custom_data: { organization_id: '2' },
//     webhook_id: 'cfed6a35-0138-40fc-adf7-c1ebd57b3eab'
//   },
//   data: {
//     type: 'subscriptions',
//     id: '1555455',
//     attributes: {
//       store_id: 223160,
//       customer_id: 6921404,
//       order_id: 6590604,
//       order_item_id: 6533858,
//       product_id: 651174,
//       variant_id: 1022464,
//       product_name: 'm1os',
//       variant_name: 'Default',
//       user_name: 'John',
//       user_email: '82mailer@gmail.com',
//       status: 'active',
//       status_formatted: 'Active',
//       card_brand: 'visa',
//       card_last_four: '4242',
//       payment_processor: 'stripe',
//       pause: null,
//       cancelled: false,
//       trial_ends_at: null,
//       billing_anchor: 12,
//       first_subscription_item: [Object],
//       urls: [Object],
//       renews_at: '2025-11-12T16:17:19.000000Z',
//       ends_at: null,
//       created_at: '2025-10-12T16:17:21.000000Z',
//       updated_at: '2025-10-12T16:17:25.000000Z',
//       test_mode: true
//     },
//     relationships: {
//       store: [Object],
//       customer: [Object],
//       order: [Object],
//       'order-item': [Object],
//       product: [Object],
//       variant: [Object],
//       'subscription-items': [Object],
//       'subscription-invoices': [Object]
//     },
//     links: { self: 'https://api.lemonsqueezy.com/v1/subscriptions/1555455' }
//   }
// }
// 1760285880155 => successfully connected to database
// {
//   meta: {
//     test_mode: true,
//     event_name: 'subscription_created',
//     custom_data: { organization_id: '2' },
//     webhook_id: '8d04b6e9-6770-432a-b0ed-8c97376af2ab'
//   },
//   data: {
//     type: 'subscriptions',
//     id: '1555457',
//     attributes: {
//       store_id: 223160,
//       customer_id: 6921427,
//       order_id: 6590617,
//       order_item_id: 6533871,
//       product_id: 651174,
//       variant_id: 1022464,
//       product_name: 'm1os',
//       variant_name: 'Default',
//       user_name: 'John',
//       user_email: 'khamidov.ko@gmail.com',
//       status: 'active',
//       status_formatted: 'Active',
//       card_brand: 'visa',
//       card_last_four: '4242',
//       payment_processor: 'stripe',
//       pause: null,
//       cancelled: false,
//       trial_ends_at: null,
//       billing_anchor: 12,
//       first_subscription_item: [Object],
//       urls: [Object],
//       renews_at: '2025-11-12T16:19:55.000000Z',
//       ends_at: null,
//       created_at: '2025-10-12T16:19:57.000000Z',
//       updated_at: '2025-10-12T16:20:03.000000Z',
//       test_mode: true
//     },
//     relationships: {
//       store: [Object],
//       customer: [Object],
//       order: [Object],
//       'order-item': [Object],
//       product: [Object],
//       variant: [Object],
//       'subscription-items': [Object],
//       'subscription-invoices': [Object]
//     },
//     links: { self: 'https://api.lemonsqueezy.com/v1/subscriptions/1555457' }
//   }
// }
// {
//   meta: {
//     test_mode: true,
//     event_name: 'subscription_updated',
//     custom_data: { organization_id: '2' },
//     webhook_id: 'bd10b915-66e7-46b8-8321-34bb873946d7'
//   },
//   data: {
//     type: 'subscriptions',
//     id: '1555457',
//     attributes: {
//       store_id: 223160,
//       customer_id: 6921427,
//       order_id: 6590617,
//       order_item_id: 6533871,
//       product_id: 651174,
//       variant_id: 1022464,
//       product_name: 'm1os',
//       variant_name: 'Default',
//       user_name: 'John',
//       user_email: 'khamidov.ko@gmail.com',
//       status: 'active',
//       status_formatted: 'Active',
//       card_brand: 'visa',
//       card_last_four: '4242',
//       payment_processor: 'stripe',
//       pause: null,
//       cancelled: false,
//       trial_ends_at: null,
//       billing_anchor: 12,
//       first_subscription_item: [Object],
//       urls: [Object],
//       renews_at: '2025-11-12T16:19:55.000000Z',
//       ends_at: null,
//       created_at: '2025-10-12T16:19:57.000000Z',
//       updated_at: '2025-10-12T16:20:03.000000Z',
//       test_mode: true
//     },
//     relationships: {
//       store: [Object],
//       customer: [Object],
//       order: [Object],
//       'order-item': [Object],
//       product: [Object],
//       variant: [Object],
//       'subscription-items': [Object],
//       'subscription-invoices': [Object]
//     },
//     links: { self: 'https://api.lemonsqueezy.com/v1/subscriptions/1555457' }
//   }
// }
// {
//   meta: {
//     test_mode: true,
//     event_name: 'subscription_payment_success',
//     custom_data: { organization_id: '2' },
//     webhook_id: '5015b6c9-778b-4274-b531-484330776dea'
//   },
//   data: {
//     type: 'subscription-invoices',
//     id: '4728259',
//     attributes: {
//       store_id: 223160,
//       subscription_id: 1555457,
//       customer_id: 6921427,
//       user_name: 'John',
//       user_email: 'khamidov.ko@gmail.com',
//       billing_reason: 'initial',
//       card_brand: 'visa',
//       card_last_four: '4242',
//       currency: 'UZS',
//       currency_rate: '0.00008285',
//       status: 'paid',
//       status_formatted: 'Paid',
//       refunded: false,
//       refunded_at: null,
//       subtotal: 9897405,
//       discount_total: 0,
//       tax: 0,
//       tax_inclusive: false,
//       total: 9897405,
//       refunded_amount: 0,
//       subtotal_usd: 820,
//       discount_total_usd: 0,
//       tax_usd: 0,
//       total_usd: 820,
//       refunded_amount_usd: 0,
//       subtotal_formatted: 'UZS98,974',
//       discount_total_formatted: 'UZS0',
//       tax_formatted: 'UZS0',
//       total_formatted: 'UZS98,974',
//       refunded_amount_formatted: 'UZS0',
//       urls: [Object],
//       created_at: '2025-10-12T16:19:58.000000Z',
//       updated_at: '2025-10-12T16:20:34.000000Z',
//       test_mode: true
//     },
//     relationships: { store: [Object], subscription: [Object], customer: [Object] },
//     links: {
//       self: 'https://api.lemonsqueezy.com/v1/subscription-invoices/4728259'
//     }
//   }
// }

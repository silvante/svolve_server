import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async generateCheckout(req: RequestWithUser) {
    const org = req.organization;
    const user = req.user;

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
            product_id: process.env.PAYMENT_PRODUCT_ID,
            checkout_data: {
              email: user.email,
              custom: {
                organization_id: org.id,
              },
            },
          },
        },
      }),
    });

    const checkout = await response.json();
    return {
      organization: org,
      url: checkout.data.attributes.url,
    };
  }
}

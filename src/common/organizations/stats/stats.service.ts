import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getClientsStats(req: RequestWithUser) {
    const org = req.organization;
    const orgId = org.id;

    const clientsByMonth = await this.prisma.$queryRaw<
      { month: string; count: number }[]
    >`
    SELECT TO_CHAR(d, 'YYYY-MM') AS month,
           COALESCE(COUNT(c.id), 0)::int AS count
    FROM generate_series(
           date_trunc('month', NOW() - interval '11 months'),
           date_trunc('month', NOW()),
           interval '1 month'
         ) d
    LEFT JOIN "Client" c
           ON date_trunc('month', c.created_at) = d
          AND c.organization_id = ${orgId}
    GROUP BY d
    ORDER BY d;
  `;

    // Clients by Day (last 30 days, includes 0 days)
    const clientsByDay = await this.prisma.$queryRaw<
      { day: string; count: number }[]
    >`
      SELECT TO_CHAR(d, 'YYYY-MM-DD') AS day,
             COALESCE(COUNT(c.id), 0)::int AS count
      FROM generate_series(
             (CURRENT_DATE - interval '30 days'),
             CURRENT_DATE,
             interval '1 day'
           ) d
      LEFT JOIN "Client" c
             ON date_trunc('day', c.created_at) = d
            AND c.organization_id = ${orgId}
      GROUP BY d
      ORDER BY d;
    `;

    // Clients by Type
    const clientsByType = await this.prisma.client.groupBy({
      by: ['type_id'],
      _count: { id: true },
      where: { organization_id: orgId },
    });

    return { clientsByMonth, clientsByDay, clientsByType };
  }
}

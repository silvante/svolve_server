import { HttpException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfDay, endOfDay } from 'date-fns';
import { UpdateClientDto } from './dto/update-client.dto';
import { SearchClientParamsDto } from './dto/search-clients.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: RequestWithUser, data: CreateClientDto) {
    const organization = req.organization;

    const { type_id, ...clientData } = data;
    const client = await this.prisma.client.create({
      data: {
        ...clientData,
        type: {
          connect: {
            id: type_id,
          },
        },
        organization: {
          connect: {
            id: organization.id,
          },
        },
      },
      include: {
        type: true,
      },
    });

    return client;
  }

  async findTodayClients(req: RequestWithUser) {
    const organization = req.organization;
    const worker = req.worker;

    const day_start = startOfDay(new Date());
    const day_end = endOfDay(new Date());

    let where: any = {};
    if (worker && worker.role === 'doctor') {
      const typeIds = worker.attached_types.map((at) => at.id);
      where = {
        organization_id: organization.id,
        created_at: {
          gte: day_start,
          lte: day_end,
        },
        type_id: { in: typeIds },
      };
    } else {
      where = {
        organization_id: organization.id,
        created_at: {
          gte: day_start,
          lte: day_end,
        },
      };
    }

    const clients = await this.prisma.client.findMany({
      where: where,
      include: {
        type: true,
      },
    });

    if (!clients) {
      throw new HttpException('Server error, please try again later', 404);
    }
    if (worker && worker.role === 'doctor') {
      return {
        clients: clients,
      };
    } else {
      const types = await this.prisma.type.findMany({
        where: { organization_id: organization.id },
        include: {
          _count: {
            select: {
              clients: true,
              attached_workers: true,
            },
          },
        },
      });
      return {
        clients: clients,
        types: types,
      };
    }
  }

  async checkClient(req: RequestWithUser, client_id: number) {
    const org = req.organization;
    const worker = req.worker;
    let where: any = {};

    if (worker && worker.role === 'doctor') {
      const typeIds = worker.attached_types.map((at) => at.id);

      where = {
        id: client_id,
        organization_id: org.id,
        type_id: {
          in: typeIds,
        },
      };
    } else {
      where = { id: client_id, organization_id: org.id };
    }

    const updated = await this.prisma.client.update({
      where: where,
      data: {
        is_checked: true,
      },
      include: {
        type: true,
      },
    });

    if (!updated) {
      throw new HttpException('Internal server error', 404);
    }

    return {
      checked: true,
      client: updated,
    };
  }

  async updateClient(
    req: RequestWithUser,
    client_id: number,
    data: UpdateClientDto,
  ) {
    const organization = req.organization;
    const client = await this.prisma.client.findUnique({
      where: { id: client_id, organization_id: organization.id },
      include: {
        organization: true,
      },
    });

    if (!client) {
      throw new HttpException(
        'this organization does not own this client, or server error',
        404,
      );
    }

    if (client.is_checked) {
      throw new HttpException(
        'You can not update client if it has already checked',
        404,
      );
    }

    const { type_id, ...updateData } = data;
    const updated = await this.prisma.client.update({
      where: { id: client.id },
      data: {
        ...updateData,
        type: {
          connect: {
            id: type_id,
          },
        },
      },
      include: {
        type: true,
      },
    });

    return updated;
  }

  async DeleteClients(req: RequestWithUser, client_id: number) {
    const organization = req.organization;
    const client = await this.prisma.client.findUnique({
      where: { id: client_id, organization_id: organization.id },
      include: {
        organization: true,
      },
    });

    if (!client) {
      throw new HttpException(
        'this organization does not own this client, or server error',
        404,
      );
    }

    if (client.is_checked) {
      throw new HttpException(
        'You can not delete client if it has already checked',
        404,
      );
    }

    await this.prisma.client.delete({ where: { id: client.id } });
    return {
      deleted: true,
    };
  }

  async searchClients(req: RequestWithUser, query: SearchClientParamsDto) {
    const org = req.organization;
    const skip = (query.page - 1) * query.limit;

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where: {
          organization_id: org.id,
          is_checked: true,
          name: {
            contains: query.name,
            mode: 'insensitive',
          },
          surname: {
            contains: query.surname,
            mode: 'insensitive',
          },
          ...(query.born_in && { born_in: query.born_in }),
          ...(query.type_id && { type_id: query.type_id }),
        },
        skip,
        take: query.limit,
        orderBy: { created_at: 'desc' },
        include: {
          type: true,
        },
      }),
      this.prisma.client.count({
        where: {
          organization_id: org.id,
          is_checked: true,
          name: {
            contains: query.name,
            mode: 'insensitive',
          },
          surname: {
            contains: query.surname,
            mode: 'insensitive',
          },
          ...(query.born_in && { born_in: query.born_in }),
          ...(query.type_id && { type_id: query.type_id }),
        },
      }),
    ]);

    return {
      data,
      meta: {
        total: total,
        page: query.page,
        last_page: Math.ceil(total / query.limit),
      },
    };
  }
}

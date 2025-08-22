import { HttpException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfDay, endOfDay } from 'date-fns';
import { UpdateClientDto } from './dto/update-client.dto';

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

    const day_start = startOfDay(new Date());
    const day_end = endOfDay(new Date());

    const clients = await this.prisma.client.findMany({
      where: {
        organization_id: organization.id,
        created_at: {
          gte: day_start,
          lte: day_end,
        },
      },
      include: {
        type: true,
      },
    });
    if (!clients) {
      throw new HttpException('Server error, please try again later', 404);
    }
    const types = await this.prisma.type.findMany({
      where: { organization_id: organization.id },
      include: {
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });

    return {
      clients: clients,
      types: types,
    };
  }

  async checkClient(req: RequestWithUser, org_id: number, client_id: number) {
    const user = req.user;

    const org = await this.prisma.organization.findUnique({
      where: { id: org_id, owner_id: user.id },
    });

    if (!org) {
      throw new HttpException('you do not own this organization', 404);
    }

    const updated = await this.prisma.client.update({
      where: { id: client_id, organization_id: org?.id },
      data: {
        is_checked: true,
      },
      include: {
        type: true,
      },
    });

    if (!updated) {
      throw new HttpException('INternal server error', 404);
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
}

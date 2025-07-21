import { HttpException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfDay, endOfDay } from 'date-fns';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: RequestWithUser, org_id: number, data: CreateClientDto) {
    const user = req.user;

    const organisation = await this.prisma.organisation.findUnique({
      where: { id: org_id, owner_id: user.id },
    });

    if (!organisation) {
      throw new HttpException('you do not own this organisation', 404);
    }

    const { type_id, ...clientData } = data;
    const client = await this.prisma.client.create({
      data: {
        ...clientData,
        type: {
          connect: {
            id: type_id,
          },
        },
        organisation: {
          connect: {
            id: organisation.id,
          },
        },
      },
      include: {
        type: true,
      },
    });

    return client;
  }

  async findTodayClients(req: RequestWithUser, org_id: number) {
    const user = req.user;
    const organisation = await this.prisma.organisation.findUnique({
      where: { id: org_id, owner_id: user.id },
    });
    if (!organisation) {
      throw new HttpException('you do not own this organisation', 404);
    }

    const day_start = startOfDay(new Date());
    const day_end = endOfDay(new Date());

    const clients = await this.prisma.client.findMany({
      where: {
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
      where: { organisation_id: organisation.id },
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

    const org = await this.prisma.organisation.findUnique({
      where: { id: org_id, owner_id: user.id },
    });

    if (!org) {
      throw new HttpException('you do not own this organisation', 404);
    }

    const updated = await this.prisma.client.update({
      where: { id: client_id, organisation_id: org?.id },
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
    params: { org_id: number; client_id: number },
    data: UpdateClientDto,
  ) {
    const user = req.user;
    const client = await this.prisma.client.findUnique({
      where: { id: params.client_id, organisation_id: params.org_id },
      include: {
        organisation: true,
      },
    });

    if (!client) {
      throw new HttpException(
        'this organisation does not own this client, or server error',
        404,
      );
    }

    if (client.organisation.owner_id !== user.id) {
      throw new HttpException('you do not own this organisation', 404);
    }

    const isToday = (date: Date) => {
      const today = new Date();
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    };

    if (!isToday(client.created_at)) {
      throw new HttpException(
        'You can update client only if it has created today',
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
}

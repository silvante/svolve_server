import { HttpException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfDay, endOfDay } from 'date-fns';

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
        owner: {
          connect: {
            id: organisation.owner_id,
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
    });

    return {
      clients: clients,
      types: types,
    };
  }
}

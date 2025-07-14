import { HttpException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

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
    });
  }
}

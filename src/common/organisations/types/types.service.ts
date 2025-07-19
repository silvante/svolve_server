import { HttpException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(org_id: number, req: RequestWithUser) {
    const user = req.user;
    const org = await this.prisma.organisation.findUnique({
      where: { owner_id: user.id, id: org_id },
    });
    if (!org) {
      throw new HttpException('you do not own this organisation', 404);
    }
    const types = await this.prisma.type.findMany({
      where: { organisation_id: org_id },
      include: {
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });
    if (!types) {
      throw new HttpException('Server error, please try again later', 404);
    }
    return types;
  }

  async createType(req: any, org_id: number, data: any) {
    const user = req.user;
    const organisation = await this.prisma.organisation.findUnique({
      where: { id: org_id, owner_id: user.id },
    });

    if (!organisation) {
      throw new HttpException('You do not own this organisation', 404);
    }

    const type = await this.prisma.type.create({
      data: {
        ...data,
        organisation: {
          connect: { id: organisation.id },
        },
      },
      include: {
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });

    return type;
  }

  async updateType(
    req: RequestWithUser,
    params: { org_id: number; type_id: number },
    data: UpdateTypeDto,
  ) {
    const user = req.user;
    const org = await this.prisma.organisation.findUnique({
      where: { id: params.org_id, owner_id: user.id },
    });

    if (!org) {
      throw new HttpException('You do not own this organisation', 404);
    }

    const updated = await this.prisma.type.update({
      where: { id: params.type_id, organisation_id: org.id },
      data: data,
      include: {
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });

    if (!updated) {
      throw new HttpException(
        'Type not defined, or you do not own this type',
        400,
      );
    }

    return updated;
  }
}

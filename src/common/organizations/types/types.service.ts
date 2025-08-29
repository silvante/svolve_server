import { HttpException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(org_id: number, req: RequestWithUser) {
    const user = req.user;
    const org = await this.prisma.organization.findUnique({
      where: { owner_id: user.id, id: org_id },
    });
    if (!org) {
      throw new HttpException('you do not own this organization', 404);
    }
    const types = await this.prisma.type.findMany({
      where: { organization_id: org_id },
      include: {
        _count: {
          select: {
            clients: true,
            attached_workers: true,
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
    const organization = await this.prisma.organization.findUnique({
      where: { id: org_id, owner_id: user.id },
    });

    if (!organization) {
      throw new HttpException('You do not own this organization', 404);
    }

    const type = await this.prisma.type.create({
      data: {
        ...data,
        organization: {
          connect: { id: organization.id },
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
    const org = await this.prisma.organization.findUnique({
      where: { id: params.org_id, owner_id: user.id },
    });

    if (!org) {
      throw new HttpException('You do not own this organization', 404);
    }

    const updated = await this.prisma.type.update({
      where: { id: params.type_id, organization_id: org.id },
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

  async deleteType(
    req: RequestWithUser,
    params: { org_id: number; type_id: number },
  ) {
    const user = req.user;

    const type = await this.prisma.type.findUnique({
      where: { id: params.type_id, organization_id: params.org_id },
      include: {
        organization: true,
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });

    if (type?.organization?.owner_id !== user.id) {
      throw new HttpException('You do not own this organization', 404);
    }

    if (type._count.clients > 0) {
      throw new HttpException(
        'You can not delete this type, it has clients attached.',
        404,
      );
    }

    await this.prisma.type.delete({ where: { id: type.id } });
    return {
      deleted: true,
    };
  }
}

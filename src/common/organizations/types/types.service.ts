import { HttpException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(req: RequestWithUser) {
    const org = req.organization;
    if (!org) {
      throw new HttpException('you do not own this organization', 404);
    }
    const types = await this.prisma.type.findMany({
      where: { organization_id: org.id },
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

  async createType(req: any, data: any) {
    const organization = req.organization;

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

  async updateType(req: RequestWithUser, type_id: number, data: UpdateTypeDto) {
    const org = req.organization;

    const updated = await this.prisma.type.update({
      where: { id: type_id, organization_id: org.id },
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

  async deleteType(req: RequestWithUser, type_id: number) {
    const org = req.organization;

    const type = await this.prisma.type.findUnique({
      where: { id: type_id, organization_id: org.id },
      include: {
        organization: true,
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });

    if (!type) {
      throw new HttpException('Type not found', 404);
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

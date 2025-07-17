import { HttpException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { TypeCountQueue } from 'src/jobs/type_count/type_count.queue';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TypesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly typeCounter: TypeCountQueue,
  ) {}

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
    });

    if (type.organisation_id) {
      await this.typeCounter.count(type.organisation_id);
    }

    return type;
  }
}

import { HttpException, Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organisation_id: number) {
    const types = await this.prisma.type.findMany({
      where: { organisation_id: organisation_id },
    });
    if (!types) {
      throw new HttpException('Server error, please try again later', 404);
    }
    return types;
  }

  async createType(req: any, organisation_id: number, data: any) {
    const user = req.user;
    const organisation = await this.prisma.organisation.findUnique({
      where: { id: organisation_id },
    });

    if (!organisation) {
      throw new HttpException('Organisation not found', 404);
    }

    if (organisation.owner_id !== user.id) {
      throw new HttpException(
        'You are not the owner of this organisation',
        403,
      );
    }

    const type = await this.prisma.type.create({
      data: {
        ...data,
        organisation: {
          connect: { id: organisation_id },
        },
      },
    });

    return type;
  }
}

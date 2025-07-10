import { HttpException, Injectable } from '@nestjs/common';
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
}

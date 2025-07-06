import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganisationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrganisations(req: RequestWithUser) {
    const user = req.user;
    const organisations = await this.prisma.organisation.findMany({
      where: { owner_id: user.id },
    });
    return organisations;
  }
}

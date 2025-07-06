import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganisationDto } from './dtos/create_organisation.dto';
import { GenerateUsernameService } from 'src/global/generate_username/generate_username.service';

@Injectable()
export class OrganisationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly username: GenerateUsernameService,
  ) {}

  async getOrganisations(req: RequestWithUser) {
    const user = req.user;
    const organisations = await this.prisma.organisation.findMany({
      where: { owner_id: user.id },
    });
    return organisations;
  }

  async createOrganisation(req: RequestWithUser, data: CreateOrganisationDto) {
    const user = req.user;
    const unique_name = await this.username.generate(data.name);
    const new_organisation = await this.prisma.organisation.create({
      data: {
        ...data,
        userId: user.id,
        unique_name,
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    if (!new_organisation) {
      throw new Error('Failed to create organisation');
    }
    return new_organisation;
  }
}

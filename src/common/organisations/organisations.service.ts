import { HttpException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganisationDto } from './dtos/create_organisation.dto';
import { GenerateUsernameService } from 'src/global/generate_username/generate_username.service';
import { OrganisationCountQueue } from 'src/jobs/organisation_count/organisation_count.queue';

@Injectable()
export class OrganisationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly username: GenerateUsernameService,
    private readonly OrganisationCountQueue: OrganisationCountQueue,
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
    } else {
      await this.OrganisationCountQueue.count(user.id);
    }
    return new_organisation;
  }

  async getOrganisationById(req: RequestWithUser, id: number) {
    const user = req.user;
    const organisation = await this.prisma.organisation.findUnique({
      where: { id: id, owner_id: user.id },
    });
    if (!organisation) {
      throw new HttpException('Organisation is not defined', 404);
    }
    return organisation;
  }
}

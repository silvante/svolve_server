import { HttpException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganisationDto } from './dtos/create_organisation.dto';
import { OrganisationCountQueue } from 'src/jobs/organisation_count/organisation_count.queue';
import { GenerateUniquenameService } from 'src/global/generate_uniquename/generate_uniquename.service';
import { ValidateOrganisationDto } from './dtos/validate.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganisationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uniquename: GenerateUniquenameService,
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
    const {pincode, ...form_data} = data
    const hashed_pincode = bcrypt.hashSync(pincode, 10);
    const unique_name = await this.uniquename.generate(data.name);
    const new_organisation = await this.prisma.organisation.create({
      data: {
        ...form_data,
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

  async ValidateOrganisation(
    req: RequestWithUser,
    id: number,
    data: ValidateOrganisationDto,
  ) {
    const user = req.user;
    const organisation = await this.prisma.organisation.findUnique({
      where: { id: id, owner_id: user.id },
    });
    if (!organisation) {
      throw new HttpException('Organisation is not defined', 404);
    }

    
  }
}

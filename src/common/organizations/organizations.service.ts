import { HttpException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto } from './dtos/create_organization.dto';
import { GenerateUniquenameService } from 'src/global/generate_uniquename/generate_uniquename.service';
import { ValidateOrganizationDto } from './dtos/validate.dto';
import * as bcrypt from 'bcrypt';
import { SALT_RESULT } from 'src/constants';
import { UpdateOrganizationDto } from './dtos/update_organization.dto';
import { UpdatePincodeDto } from './dtos/update_pincode.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uniquename: GenerateUniquenameService,
  ) {}

  async getOrganizations(req: RequestWithUser) {
    const user = req.user;
    const organizations = await this.prisma.organization.findMany({
      where: { owner_id: user.id },
    });
    return organizations;
  }

  async createOrganization(req: RequestWithUser, data: CreateOrganizationDto) {
    const user = req.user;
    const { pincode, banner, ...form_data } = data;
    const hashed_pincode = bcrypt.hashSync(pincode, SALT_RESULT);
    const unique_name = await this.uniquename.generate(data.name);
    const new_organization = await this.prisma.organization.create({
      data: {
        ...form_data,
        unique_name,
        pincode: hashed_pincode,
        owner: {
          connect: {
            id: user.id,
          },
        },
        banner: {
          create: {
            original: banner.original,
            thumbnail: banner.thumbnail,
          },
        },
      },
    });
    if (!new_organization) {
      throw new Error('Failed to create organization');
    }
    return new_organization;
  }

  async getOrganizationById(req: RequestWithUser, id: number) {
    const user = req.user;
    const organization = await this.prisma.organization.findUnique({
      where: { id: id, owner_id: user.id },
    });
    if (!organization) {
      throw new HttpException('Organization is not defined', 404);
    }
    return organization;
  }

  async ValidateOrganization(
    req: RequestWithUser,
    unique_name: string,
    data: ValidateOrganizationDto,
  ) {
    const user = req.user;
    const organization = await this.prisma.organization.findUnique({
      where: { unique_name: unique_name, owner_id: user.id },
    });

    // Put the payment validation logic here in the future

    if (!organization) {
      throw new HttpException('You do not own this organization', 404);
    }

    const is_pincode_valid = bcrypt.compareSync(
      data.pincode,
      organization.pincode,
    );

    if (!is_pincode_valid) {
      throw new HttpException('Invalid pincode', 400);
    }

    return { validation: true, organization: organization };
  }

  async EditOrganization(
    req: RequestWithUser,
    unique_name: string,
    data: UpdateOrganizationDto,
  ) {
    const user = req.user;

    const { banner, ...updateData } = data;
    const updated_organization = await this.prisma.organization.update({
      where: { unique_name: unique_name, owner_id: user.id },
      data: {
        ...updateData,
        banner: {
          update: {
            original: banner.original,
            thumbnail: banner.thumbnail,
          },
        },
      },
    });

    if (!updated_organization) {
      throw new HttpException(
        'You do not own this organization or internal server error',
        404,
      );
    }

    return updated_organization;
  }

  async updatePincode(
    req: RequestWithUser,
    unique_name: string,
    data: UpdatePincodeDto,
  ) {
    const user = req.user;

    const org = await this.prisma.organization.findUnique({
      where: { unique_name: unique_name, owner_id: user.id },
    });
    if (!org) {
      throw new HttpException('You do not own this organization', 404);
    }
    const is_pin_ok = bcrypt.compareSync(data.old_pincode, org.pincode);
    if (!is_pin_ok) {
      throw new HttpException('invalide pincode', 404);
    }
    if (data.new_pincode !== data.pincode_confirmation) {
      throw new HttpException('pincode confirmation should match', 404);
    }
    const updated = await this.prisma.organization.update({
      where: { id: org.id },
      data: { pincode: bcrypt.hashSync(data.new_pincode, SALT_RESULT) },
    });
    if (!updated) {
      throw new HttpException('internal server error', 404);
    }
    return updated;
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { CreateOrganisationDto } from './dtos/create_organisation.dto';
import { ValidateOrganisationDto } from './dtos/validate.dto';
import { UpdateOrganisationDto } from './dtos/update_organisation.dto';
import { UpdatePincodeDto } from './dtos/update_pincode.dto';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organistaionService: OrganisationsService) {}

  @UseGuards(AuthGuard)
  @Get('')
  getUsersOrganisations(@Req() req: RequestWithUser) {
    return this.organistaionService.getOrganisations(req);
  }

  @UseGuards(AuthGuard)
  @Post('/new')
  createOrganisation(
    @Req() req: RequestWithUser,
    @Body() data: CreateOrganisationDto,
  ) {
    return this.organistaionService.createOrganisation(req, data);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  getOrganisationById(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.organistaionService.getOrganisationById(req, +id);
  }

  @UseGuards(AuthGuard)
  @Post('/:unique_name/validate')
  ValidateOrganisation(
    @Req() req: RequestWithUser,
    @Param('unique_name') unique_name: string,
    @Body() data: ValidateOrganisationDto,
  ) {
    return this.organistaionService.ValidateOrganisation(
      req,
      unique_name,
      data,
    );
  }

  @UseGuards(AuthGuard)
  @Put('/:org_id/update')
  updateOrganisation(
    @Req() req: RequestWithUser,
    @Param('org_id') org_id: number,
    @Body() data: UpdateOrganisationDto,
  ) {
    return this.organistaionService.EditOrganisation(req, +org_id, data);
  }

  @UseGuards(AuthGuard)
  @Put('/:org_id/update/pincode')
  updatePincode(
    @Req() req: RequestWithUser,
    @Param('org_id') org_id: string,
    @Body() data: UpdatePincodeDto,
  ) {
    return this.organistaionService.updatePincode(req, +org_id, data);
  }
}

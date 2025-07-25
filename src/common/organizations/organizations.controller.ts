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
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { CreateOrganisationDto } from './dtos/create_organisation.dto';
import { ValidateOrganisationDto } from './dtos/validate.dto';
import { UpdateOrganisationDto } from './dtos/update_organisation.dto';
import { UpdatePincodeDto } from './dtos/update_pincode.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organiztaionService: OrganizationsService) {}

  @UseGuards(AuthGuard)
  @Get('')
  getUsersOrganisations(@Req() req: RequestWithUser) {
    return this.organiztaionService.getOrganisations(req);
  }

  @UseGuards(AuthGuard)
  @Post('/new')
  createOrganisation(
    @Req() req: RequestWithUser,
    @Body() data: CreateOrganisationDto,
  ) {
    return this.organiztaionService.createOrganisation(req, data);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  getOrganisationById(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.organiztaionService.getOrganisationById(req, +id);
  }

  @UseGuards(AuthGuard)
  @Post('/:unique_name/validate')
  ValidateOrganisation(
    @Req() req: RequestWithUser,
    @Param('unique_name') unique_name: string,
    @Body() data: ValidateOrganisationDto,
  ) {
    return this.organiztaionService.ValidateOrganisation(
      req,
      unique_name,
      data,
    );
  }

  @UseGuards(AuthGuard)
  @Put('/:unique_name/update')
  updateOrganisation(
    @Req() req: RequestWithUser,
    @Param('unique_name') unique_name: string,
    @Body() data: UpdateOrganisationDto,
  ) {
    return this.organiztaionService.EditOrganisation(req, unique_name, data);
  }

  @UseGuards(AuthGuard)
  @Put('/:unique_name/update/pincode')
  updatePincode(
    @Req() req: RequestWithUser,
    @Param('unique_name') unique_name: string,
    @Body() data: UpdatePincodeDto,
  ) {
    return this.organiztaionService.updatePincode(req, unique_name, data);
  }
}

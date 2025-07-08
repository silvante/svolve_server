import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { CreateOrganisationDto } from './dtos/create_organisation.dto';
import { ValidateOrganisationDto } from './dtos/validate.dto';

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
  @Post('/:id/validate')
  ValidateOrganisation(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: ValidateOrganisationDto,
  ) {
    return this.organistaionService.ValidateOrganisation(req, +id, data);
  }
}

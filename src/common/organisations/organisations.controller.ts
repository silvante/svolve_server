import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { CreateOrganisationDto } from './dtos/create_organisation.dto';

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
  ) {}
}

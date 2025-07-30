import {
  Body,
  Controller,
  Delete,
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
import { CreateOrganizationDto } from './dtos/create_organization.dto';
import { ValidateOrganizationDto } from './dtos/validate.dto';
import { UpdateOrganizationDto } from './dtos/update_organization.dto';
import { UpdatePincodeDto } from './dtos/update_pincode.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organiztaionService: OrganizationsService) {}

  @UseGuards(AuthGuard)
  @Get('')
  getUsersOrganizations(@Req() req: RequestWithUser) {
    return this.organiztaionService.getOrganizations(req);
  }

  @UseGuards(AuthGuard)
  @Post('/new')
  createOrganization(
    @Req() req: RequestWithUser,
    @Body() data: CreateOrganizationDto,
  ) {
    return this.organiztaionService.createOrganization(req, data);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  getOrganizationById(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.organiztaionService.getOrganizationById(req, +id);
  }

  @UseGuards(AuthGuard)
  @Post('/:unique_name/validate')
  ValidateOrganization(
    @Req() req: RequestWithUser,
    @Param('unique_name') unique_name: string,
    @Body() data: ValidateOrganizationDto,
  ) {
    return this.organiztaionService.ValidateOrganization(
      req,
      unique_name,
      data,
    );
  }

  @UseGuards(AuthGuard)
  @Put('/:unique_name/update')
  updateOrganization(
    @Req() req: RequestWithUser,
    @Param('unique_name') unique_name: string,
    @Body() data: UpdateOrganizationDto,
  ) {
    return this.organiztaionService.EditOrganization(req, unique_name, data);
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

  @UseGuards(AuthGuard)
  @Delete('/:unique_name/delete')
  deleteOrganization(
    @Req() req: RequestWithUser,
    @Param('unique_name') unique_name: string,
  ) {
    return this.organiztaionService.deleteOrganization(req, unique_name);
  }
}

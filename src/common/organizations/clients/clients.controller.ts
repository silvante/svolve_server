import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UpdateClientDto } from './dto/update-client.dto';
import { OrganizationAccessGuard } from 'src/guards/organization-access/organization-access.guard';
import { ReceptionistAccessGuard } from 'src/guards/receptionist-access/receptionist-access.guard';

@Controller('organizations/:org_id/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(AuthGuard, OrganizationAccessGuard, ReceptionistAccessGuard)
  @Post('new')
  create(
    @Req() req: RequestWithUser,
    @Body() createClientDto: CreateClientDto,
  ) {
    return this.clientsService.create(req, createClientDto);
  }

  @UseGuards(AuthGuard)
  @Get('today')
  getTodaysClients(
    @Req() req: RequestWithUser,
    @Param('org_id') org_id: string,
  ) {
    return this.clientsService.findTodayClients(req, +org_id);
  }

  @UseGuards(AuthGuard)
  @Put('/:client_id/check')
  checkClient(
    @Req() req: RequestWithUser,
    @Param('org_id') org_id: string,
    @Param('client_id') client_id: string,
  ) {
    return this.clientsService.checkClient(req, +org_id, +client_id);
  }

  @UseGuards(AuthGuard)
  @Put('/:client_id/update')
  updateClient(
    @Req() req: RequestWithUser,
    @Param() params: { org_id: string; client_id: string },
    @Body() data: UpdateClientDto,
  ) {
    return this.clientsService.updateClient(
      req,
      { org_id: +params.org_id, client_id: +params.client_id },
      data,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/:client_id/delete')
  deleteClient(
    @Req() req: RequestWithUser,
    @Param() params: { org_id: string; client_id: string },
  ) {
    return this.clientsService.DeleteClients(req, {
      org_id: +params.org_id,
      client_id: +params.client_id,
    });
  }
}

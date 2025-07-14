import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('organisations/:org_id/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(AuthGuard)
  @Post('new')
  create(
    @Req() req: RequestWithUser,
    @Param('org_id') org_id: string,
    @Body() createClientDto: CreateClientDto,
  ) {
    return this.clientsService.create(req, +org_id, createClientDto);
  }

  @UseGuards(AuthGuard)
  @Get('today')
  getTodaysClients(
    @Req() req: RequestWithUser,
    @Param('org_id') org_id: string,
  ) {
    return this.clientsService.findTodayClients(req, +org_id);
  }
}

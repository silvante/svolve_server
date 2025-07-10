import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @UseGuards(AuthGuard)
  @Get('/:organisation_id')
  findAll(@Param('organisation_id') organisation_id: string) {
    return this.typesService.findAll(+organisation_id);
  }

  @UseGuards(AuthGuard)
  @Post('/:organisation_id/new')
  createType(
    @Req() req: RequestWithUser,
    @Param('organisation_id') organisation_id: string,
    @Body() data: CreateTypeDto,
  ) {
    return this.typesService.createType(req, +organisation_id, data);
  }
}

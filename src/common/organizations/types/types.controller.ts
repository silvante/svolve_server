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
import { TypesService } from './types.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { OwnerAccessGuard } from 'src/guards/owner-access/owner-access.guard';
import { OrganizationAccessGuard } from 'src/guards/organization-access/organization-access.guard';

@Controller('organizations/:org_id/types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @UseGuards(AuthGuard, OrganizationAccessGuard, OwnerAccessGuard)
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.typesService.findAll(req);
  }

  @UseGuards(AuthGuard, OrganizationAccessGuard, OwnerAccessGuard)
  @Post('/new')
  createType(@Req() req: RequestWithUser, @Body() data: CreateTypeDto) {
    return this.typesService.createType(req, data);
  }

  @UseGuards(AuthGuard, OrganizationAccessGuard, OwnerAccessGuard)
  @Put('/:type_id/update')
  updateType(
    @Req() req: RequestWithUser,
    @Param('type_id') type_id: string,
    @Body() data: UpdateTypeDto,
  ) {
    return this.typesService.updateType(req, +type_id, data);
  }

  @UseGuards(AuthGuard, OrganizationAccessGuard, OwnerAccessGuard)
  @Delete('/:type_id/delete')
  deleteType(@Req() req: RequestWithUser, @Param('type_id') type_id: string) {
    return this.typesService.deleteType(req, +type_id);
  }
}

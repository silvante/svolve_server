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

@Controller('organizations/:org_id/types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Param('org_id') org_id: string, @Req() req: RequestWithUser) {
    return this.typesService.findAll(+org_id, req);
  }

  @UseGuards(AuthGuard)
  @Post('/new')
  createType(
    @Req() req: RequestWithUser,
    @Param('org_id') org_id: string,
    @Body() data: CreateTypeDto,
  ) {
    return this.typesService.createType(req, +org_id, data);
  }

  @UseGuards(AuthGuard)
  @Put('/:type_id/update')
  updateType(
    @Req() req: RequestWithUser,
    @Param() params: { org_id: string; type_id: string },
    @Body() data: UpdateTypeDto,
  ) {
    return this.typesService.updateType(
      req,
      { org_id: +params.org_id, type_id: +params.type_id },
      data,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/:type_id/delete')
  deleteType(
    @Req() req: RequestWithUser,
    @Param() params: { org_id: string; type_id: string },
  ) {
    return this.typesService.deleteType(req, {
      org_id: +params.org_id,
      type_id: +params.type_id,
    });
  }
}

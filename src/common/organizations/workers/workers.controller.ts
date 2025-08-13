import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('organizations/:org_id/workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @UseGuards(AuthGuard)
  @Post('hire/:vacancy_id')
  create(
    @Req() req: RequestWithUser,
    @Param() params: { org_id: string; vacancy_id: string },
    @Body() data: CreateWorkerDto,
  ) {
    return this.workersService.create(
      req,
      { org_id: +params.org_id, vacancy_id: +params.vacancy_id },
      data,
    );
  }
}

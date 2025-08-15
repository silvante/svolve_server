import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('organizations/:org_id/workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @UseGuards(AuthGuard)
  @Post(':vacancy_id/hire')
  create(
    @Req() req: RequestWithUser,
    @Param() params: { org_id: string; vacancy_id: string },
    @Body() data: CreateWorkerDto,
  ) {
    return this.workersService.hire(
      req,
      { org_id: +params.org_id, vacancy_id: +params.vacancy_id },
      data,
    );
  }
}

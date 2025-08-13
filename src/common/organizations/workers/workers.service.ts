import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Injectable()
export class WorkersService {
  create(
    req: RequestWithUser,
    params: { org_id: number; vacancy_id: number },
    data: CreateWorkerDto,
  ) {
    const user = req.user;
  }
}

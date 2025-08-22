import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Injectable()
export class ReceptionistAccessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    const worker = req.worker;
    const org = req.organization;
    const user = req.user;

    if (user.id === org.owner_id) {
      return true;
    }

    if (worker.role && worker.role !== 'receptionist') {
      throw new HttpException(
        'you should be receptionist or owner to use this feature',
        404,
      );
    }

    return true;
  }
}

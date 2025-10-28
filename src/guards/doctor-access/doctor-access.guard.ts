import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Injectable()
export class DoctorAccessGuard implements CanActivate {
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

    if (worker && worker.role !== 'doctor') {
      throw new HttpException(
        'you should be doctor or owner to use this feature',
        404,
      );
    }

    return true;
  }
}

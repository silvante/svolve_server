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

    if (worker.role !== 'receptionist') {
      throw new HttpException(
        'you should be receptionist or owner to use this feature',
        404,
      );
    }

    return true;
  }
}

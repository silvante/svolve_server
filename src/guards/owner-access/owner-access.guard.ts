import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Injectable()
export class OwnerAccessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    const org = req.organization;
    const user = req.user;

    if (user.id !== org.owner_id) {
      return false;
    }
    return true;
  }
}

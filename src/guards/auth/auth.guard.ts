import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    try {
      const user_data = this.jwt.verify(token);
      if (user_data.action !== 'access') {
        throw new HttpException('invalid access token', 404);
      }
      request['user'] = user_data;
      return true;
    } catch (error) {
      throw new HttpException('Authentication required', 404);
    }
  }
}

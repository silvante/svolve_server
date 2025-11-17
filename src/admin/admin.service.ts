import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(private readonly jwt: JwtService) {}

  async adminAuthenticate(password: string) {
    const ap = process.env.ADMIN_PASSWORD;
    const secret = String(ap);

    // comparing
    if (password !== secret) {
      throw new HttpException('password incorrect :(', 404);
    }

    const access_token = this.jwt.sign({ admin_access: true });
    return {
      permission: true,
      token: access_token,
    };
  }
}

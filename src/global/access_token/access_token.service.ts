import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AccessTokenService {
  constructor(private jwt: JwtService) {}

  generate(user: User) {
    const access_token: string = this.jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        action: 'access',
      },
      { expiresIn: '1m' },
    );
    return access_token;
  }
}

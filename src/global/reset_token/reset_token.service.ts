import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class ResetTokenService {
  constructor(private jwt: JwtService) {}
  generate(user: User) {
    const reset_token: string = this.jwt.sign(
      {
        email: user.email,
        action: 'reset',
      },
      { expiresIn: '45d' },
    );
    return reset_token;
  }
}

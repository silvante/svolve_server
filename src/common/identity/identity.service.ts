import { HttpException, Injectable } from '@nestjs/common';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IdentityService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (user.provider !== 'email') {
      throw new HttpException(
        `provider of ${user.email} is ${user.provider}, please use ${user.provider} to register`,
        404,
      );
    }

    // const token = this.jwt.sign({ method: 'change-password', email: "" });
    // const magic_link = `${process.env.FRONT_ORIGIN}/identity/change-password/token=${token}`;
  }
}

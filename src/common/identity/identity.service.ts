import { Injectable } from '@nestjs/common';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IdentityService {
  constructor(private prisma: PrismaService) {}

  forgotPassword(data: ForgotPasswordDto) {}
}

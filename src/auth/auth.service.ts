import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterDto } from './dtos/register.dto';
import { MailQueue } from 'src/jobs/processors/mail/mail.queue';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private mailQueue: MailQueue) {}

  async RegisterUser(data: RegisterDto) {
    this.mailQueue.sendVerificationMail(data.email)
  }
}

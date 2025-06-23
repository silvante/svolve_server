import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyMailService {
  constructor(private mailer: MailerService) {}

  send(email: string, magic_link: string) {
    this.mailer.sendMail({
      to: email,
      subject: 'Verify your identity | Svolve',
      text: 'You can verify your email by clicking the link below',
      html: `<a href=${magic_link} target="_blanck">Verify my identity</a>`,
    });
  }
}

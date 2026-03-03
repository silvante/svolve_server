import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SesService } from '../ses/ses.service';

@Injectable()
export class VerifyMailService {
  constructor(private mailer: MailerService, private ses: SesService) {}

  async send(email: string, magic_link: string) {
    // this.mailer.sendMail({
    //   to: email,
    //   subject: 'Verify your identity | Svolve',
    //   text: 'You can verify your email by clicking the link below',
    //   html: `<a href=${magic_link} target="_blanck">Verify my identity</a>`,
    // });
    await this.ses.sendEmail(
      email,
      'Verify your identity | Svolve',
      'You can verify your email by clicking the link below',
      `<a href=${magic_link} target="_blanck">Verify my identity</a>`
    );
  }
}

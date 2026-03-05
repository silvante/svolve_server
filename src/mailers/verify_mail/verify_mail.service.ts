import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SesService } from '../ses/ses.service';

@Injectable()
export class VerifyMailService {
  constructor(
    private mailer: MailerService,
    private ses: SesService,
  ) {}

  async send(email: string, magic_link: string) {
    const subject = 'Shaxsingizni tasdiqlang | Svolve';
    const body = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
              'Segoe UI Symbol';
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #333333;
            font-size: 24px;
          }
          .content p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
          }
          .button-container {
            text-align: center;
            margin-top: 30px;
          }
          .button {
            background-color: #007bff;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            display: inline-block;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #888888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Svolve-ga xush kelibsiz!</h1>
          </div>
          <div class="content">
            <p>
              Hisobingizni faollashtirish va platformamizdan toʻliq
              foydalanishni boshlash uchun quyidagi tugmani bosib, elektron
              pochta manzilingizni tasdiqlang.
            </p>
          </div>
          <div class="button-container">
            <a href="${magic_link}" target="_blank" class="button"
              >Pochtani tasdiqlash</a
            >
          </div>
          <div class="footer">
            <p>
              Agar siz ro'yxatdan o'tmagan bo'lsangiz, ushbu xatni e'tiborsiz
              qoldiring.
            </p>
            <p>&copy; 2026 Svolve. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </body>
    </html>
    `;
    await this.ses.sendEmail(email, subject, body);
  }
}

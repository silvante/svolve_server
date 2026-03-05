import { Injectable } from '@nestjs/common';
import { SesService } from '../ses/ses.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VerifyMailService {
  constructor(private ses: SesService) {}

  async send(email: string, name: string, magic_link: string) {
    const subject = 'Svolve-ga xush kelibsiz! Iltimos, elektron pochtangizni tasdiqlang';

    // const templatePath = path.join(__dirname, '..', 'templates', 'verify.hbs');
    // const template = fs.readFileSync(templatePath, 'utf-8');

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .button {
                background-color: #7c3aed; /* Violet */
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 8px;
            }
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 20px 0 30px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
                        <tr>
                            <td align="center" style="padding: 40px 0 30px 0;">
                                <img src="https://svolve.uz/icons/logo.svg" alt="Svolve Logo" width="150" style="display: block;" />
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 30px 40px 30px;">
                                <h1 style="font-size: 28px; color: #333333; text-align: center;">Svolve'ga xush kelibsiz, ${name}! 🎉</h1>
                                <p style="font-size: 18px; color: #555555; text-align: center; line-height: 1.6;">Hisobingizni faollashtirish va platformamizdan toʻliq foydalanishni boshlash uchun quyidagi tugmani bosib, elektron pochta manzilingizni tasdiqlang.</p>
                                <p style="font-size: 18px; color: #555555; text-align: center; line-height: 1.6;">Tasdiqlash uchun quyidagi tugmani bosing:</p>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <a href="${magic_link}" class="button">E-pochtani tasdiqlash!</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#f4f4f4" style="padding: 30px 30px 30px 30px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                                <p style="margin: 0; text-align: center; font-size: 14px; color: #888888;">Agar savollaringiz bo'lsa, biz bilan <span style="color: #888888;">+998 33 745 82 82</span> orqali bog'laning.</p>
                            </td>
                            <td bgcolor="#f4f4f4" style="padding: 30px 30px 30px 30px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                                <p style="margin: 0; text-align: center; font-size: 14px; color: #888888;">© 2026 Svolve. Barcha huquqlar himoyalangan.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `

    const textBody = `
    Welcome to Svolve, ${name}! 🎉

    We're thrilled to have you on board. Get ready to experience a new way of managing your tasks and projects.

    Click the link below to get started:
    ${magic_link}

    If you have any questions, feel free to contact us at support@svolve.uz.
    `;

    await this.ses.sendEmail(email, subject, htmlBody, textBody);
  }
}

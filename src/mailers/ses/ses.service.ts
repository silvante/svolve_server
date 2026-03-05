import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SesService {
  private sesClient = new SESClient({
    region: process.env.AWS_SES_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });

  async sendEmail(to: string, subject:string, body: string, textBody?: string) {
    const command = new SendEmailCommand({
      Source: '"📦 Diagnos Uz" <no-reply@diagnos.uz>',
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: body,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody || body,
            Charset: 'UTF-8',
          }
        },
      },
    });

    return this.sesClient.send(command);
  }
}

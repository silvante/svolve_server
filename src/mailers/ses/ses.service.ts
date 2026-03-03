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

  async sendEmail(to: string, subject: string, text: string, body: string) {
    const command = new SendEmailCommand({
      Source: 'no-reply@svolve.uz',
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
            Text: {Data: text},
            Html: {Data: body}
        }
      },
    });

    return this.sesClient.send(command)
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialAuthResponceService {
  respond(messages: any) {
    const str = JSON.stringify(messages);
    const url = process.env.FRONT_ORIGIN;

    return `
        <html>
          <body>
            <script>
              window.opener.postMessage(${str}, "${url}");
              window.close();
            </script>
          </body>
        </html>
    `;
  }
}

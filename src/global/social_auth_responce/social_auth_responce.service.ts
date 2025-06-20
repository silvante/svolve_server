import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialAuthResponceService {
  respond(messages: any) {
    const str = JSON.stringify(messages);

    return `
        <html>
          <body>
            <script>
              window.opener.postMessage(${str}, "http://localhost:3000");
              window.close();
            </script>
          </body>
        </html>
    `;
  }
}

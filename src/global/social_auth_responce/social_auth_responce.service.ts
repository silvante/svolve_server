import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialAuthResponceService {
  respond(messages: any) {
    return `
        <html>
          <body>
            <script>
              window.opener.postMessage(${messages}, "http://localhost:3000");
              window.close();
            </script>
          </body>
        </html>
    `;
  }
}

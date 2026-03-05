import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Got new request! :)');
    return 'Diagnos is the new name!';
  }
}

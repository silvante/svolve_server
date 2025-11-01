import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Got new request! :)');
    // Main plot
    return 'Svolve is the word came from --Solve and --Evolve!';
  }
}

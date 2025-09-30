import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Svolve is the word came from -Solve and -Evolve!';
  }
}

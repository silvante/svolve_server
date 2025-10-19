import { Injectable } from '@nestjs/common';

@Injectable()
export class MagicLinkGeneratorService {
  generate(token: string) {
    const magic_link = `${process.env.FRONT_ORIGIN}/verification/?token=${token}`;
    return magic_link;
  }
}

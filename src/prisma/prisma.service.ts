import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect()
      .then(() =>
        console.log(`${Date.now()} => successfully connected to database`),
      )
      .catch((err) =>
        console.log(`${Date.now()} => error while connectiong database => ${err.message}`),
      );
  }
}

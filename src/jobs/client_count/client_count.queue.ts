import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { Queue } from 'bullmq';
import { QUEUE_NAME } from 'src/constants';

@Injectable()
export class ClientCountQueue {
  constructor(@InjectQueue(QUEUE_NAME) private mailQueue: Queue) {}

  JOB_NAME = 'client_count';

  async count(client: Client) {
    await this.mailQueue.add(this.JOB_NAME, { client });
  }
}

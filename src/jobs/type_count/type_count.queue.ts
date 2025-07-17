import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAME } from 'src/constants';

@Injectable()
export class TypeCountQueue {
  constructor(@InjectQueue(QUEUE_NAME) private mailQueue: Queue) {}

  JOB_NAME = 'type_count';

  async count(org_id: number) {
    await this.mailQueue.add(this.JOB_NAME, { org_id });
  }
}

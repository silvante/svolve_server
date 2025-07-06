import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAME } from 'src/constants';

@Injectable()
export class OrganisationCountQueue {
  constructor(@InjectQueue(QUEUE_NAME) private mailQueue: Queue) {}

  JOB_NAME = 'organisation_count';

  async count(user_id: number) {
    await this.mailQueue.add(this.JOB_NAME, { user_id });
  }
}

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAME } from 'src/constants';

@Injectable()
export class MailService {
  constructor(@InjectQueue(QUEUE_NAME) private mailQueue: Queue) {}
}

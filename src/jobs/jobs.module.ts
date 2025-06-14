import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAME } from 'src/constants';
import { MailQueueService } from './processors/mail/mail.queue';
import { MailProcessor } from './processors/mail/mail.processor';

@Module({
  imports: [
    MailerModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
  ],
  providers: [MailQueueService, MailProcessor],
  exports: [MailQueueService],
})
export class JobsModule {}

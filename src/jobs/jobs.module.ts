import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAME } from 'src/constants';
import { MailQueue } from './processors/mail/mail.queue';
import { MailProcessor } from './processors/mail/mail.processor';
import { OrganisationCountQueue } from './organisation_count/organisation_count.queue';
import { OrganisationCountProcessor } from './organisation_count/organisation_count.processor';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TypeCountQueue } from './type_count/type_count.queue';
import { TypeCountProcessor } from './type_count/type_count.processor';

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
    PrismaModule,
  ],
  providers: [
    MailQueue,
    MailProcessor,
    OrganisationCountQueue,
    OrganisationCountProcessor,
    TypeCountQueue,
    TypeCountProcessor,
  ],
  exports: [MailQueue, OrganisationCountQueue, TypeCountQueue],
})
export class JobsModule {}
``;

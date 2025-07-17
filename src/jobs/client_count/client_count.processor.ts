import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Client } from '@prisma/client';
import { Job } from 'bullmq';
import { QUEUE_NAME } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor(QUEUE_NAME)
export class ClientCountProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async process(job: Job): Promise<any> {
    if (job.name === 'client_count') {
      const client: Client = job.data.client;
      if (!client.type_id || !client.organisation_id) {
        return;
      }

      // type
      const countForType = await this.prisma.client.count({
        where: { type_id: client.type_id },
      });
      await this.prisma.type.update({
        where: { id: client.type_id },
        data: {
          client_count: countForType,
        },
      });

      // organisation
      const countForOrganisation = await this.prisma.client.count({
        where: { organisation_id: client.organisation_id },
      });
      await this.prisma.organisation.update({
        where: { id: client.organisation_id },
        data: {
          client_count: countForOrganisation,
        },
      });
      console.log('Client Count Job, terminate');
    }
  }
}

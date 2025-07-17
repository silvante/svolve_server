import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAME } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor(QUEUE_NAME)
export class TypeCountProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async process(job: Job): Promise<any> {
    if (job.name === 'type_count') {
      const org_id = job.data.org_id;
      const count = await this.prisma.type.count({
        where: { organisation_id: org_id },
      });
      await this.prisma.organisation.update({
        where: { id: org_id },
        data: { type_count: count },
      });

      console.log('Type Count Job, terminate');
    }
  }
}

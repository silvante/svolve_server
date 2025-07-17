import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAME } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor(QUEUE_NAME)
export class OrganisationCountProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async process(job: Job): Promise<any> {
    if (job.name === 'organisation_count') {
      const user_id = job.data.user_id;
      const count = await this.prisma.organisation.count({
        where: { owner_id: user_id },
      });
      await this.prisma.user.update({
        where: { id: user_id },
        data: { organisation_count: count },
      });

      console.log('Organisation Count Job, terminate');
    }
  }
}

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Organization } from '@prisma/client';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    const user = req.user;
    const unique_name = req.params.unique_name;
    const org_id = req.params.org_id;

    if (!user || (!org_id && !unique_name)) {
      throw new HttpException('Unauthorized', 401);
    }

    const where = unique_name ? { unique_name } : { id: Number(org_id) };

    const organization = await this.prisma.organization.findUnique({
      where,
      include: { workers: { select: { worker_id: true } } },
    });

    if (!organization) {
      throw new HttpException('Organization not found', 404);
    }

    const isOwner = organization.owner_id === user.id;
    const isWorker = organization.workers.some((w) => w.worker_id === user.id);

    if (!isOwner && !isWorker) {
      throw new HttpException('Forbidden', 403);
    }

    req.organization = organization;

    return true;
  }
}

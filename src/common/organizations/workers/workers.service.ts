import { HttpException, Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async hire(
    req: RequestWithUser,
    params: { org_id: number; vacancy_id: number },
    data: CreateWorkerDto,
  ) {
    const user = req.user;
    const organization = await this.prisma.organization.findUnique({
      where: { owner_id: user.id, id: params.org_id },
      include: {
        workers: true,
      },
    });
    if (!organization) {
      throw new HttpException('You do not own this organization', 404);
    }
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id: params.vacancy_id },
      include: {
        user: true,
      },
    });
    if (!vacancy) {
      throw new HttpException('Vacancy not found', 404);
    }
    const existing_worker = organization.workers.find(
      (w) => w.worker_id === vacancy.user_id,
    );
    if (existing_worker) {
      throw new HttpException('You already hired this worker', 404);
    }

    const { attached_types, role } = data;

    if (role === 'doctor' && attached_types) {
      const new_worker = await this.prisma.worker.create({
        data: {
          worker: {
            connect: {
              id: vacancy.user.id,
            },
          },
          organization: {
            connect: {
              id: organization.id,
            },
          },
          role: 'doctor',
          attached_types: {
            create: attached_types.map((id) => ({
              type: {
                connect: {
                  id: id,
                },
              },
            })),
          },
        },
        include: {
          worker: true,
          attached_types: {
            include: {
              type: true,
            },
          },
        },
      });

      return new_worker;
    } else {
      const new_worker = await this.prisma.worker.create({
        data: {
          worker: {
            connect: {
              id: vacancy.user.id,
            },
          },
          organization: {
            connect: {
              id: organization.id,
            },
          },
          role: 'receptionist',
        },
        include: {
          worker: true,
          attached_types: {
            include: {
              type: true,
            },
          },
        },
      });

      return new_worker;
    }
  }
}

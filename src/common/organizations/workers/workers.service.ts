import { HttpException, Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateWorkerDto } from './dto/update-worker.dto';

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
        user: {
          select: {
            id: true,
            works: true,
          },
        },
      },
    });
    if (!vacancy) {
      throw new HttpException('Vacancy not found', 404);
    }
    if (vacancy.user.works && vacancy.user.works.length > 0) {
      throw new HttpException(
        'This user already has a job, you can contact with him/her.',
        402,
      );
    }
    if (vacancy.user_id === user.id) {
      throw new HttpException(
        'This is your own account you can not hire yourself.',
        402,
      );
    }
    const existing_worker = organization.workers.find(
      (w) => w.worker_id === vacancy.user_id,
    );

    if (existing_worker) {
      throw new HttpException(
        'You already hired worker with the same account.',
        404,
      );
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

  async getWorkers(req: RequestWithUser, org_id: number) {
    const user = req.user;
    const workers = await this.prisma.worker.findMany({
      where: { organization_id: org_id, organization: { owner_id: user.id } },
      include: {
        worker: true,
        attached_types: {
          include: {
            type: true,
          },
        },
      },
    });
    if (!workers) {
      throw new HttpException('Internal server error', 404);
    }
    return workers;
  }

  async getAWorker(
    req: RequestWithUser,
    params: { org_id: number; id: number },
  ) {
    const user = req.user;
    const worker = await this.prisma.worker.findUnique({
      where: {
        id: params.id,
        organization_id: params.org_id,
        organization: { owner_id: user.id },
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
    if (!worker) {
      throw new HttpException('Internal server error', 404);
    }
    return worker;
  }

  async updateWorker(
    req: RequestWithUser,
    params: { org_id: number; id: number },
    data: UpdateWorkerDto,
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

    const existing_worker = organization.workers.find(
      (w) => w.id === params.id,
    );

    if (!existing_worker) {
      throw new HttpException(
        'You do not have this worker in your organization',
        404,
      );
    }

    const { attached_types, role } = data;

    let updateData: any = {};
    if (role) {
      updateData.role = role;

      if (role === 'doctor') {
        if (attached_types) {
          updateData.attached_types = {
            deleteMany: {}, // clear old
            create: attached_types.map((id) => ({
              type: { connect: { id } },
            })),
          };
        }
      } else {
        // any non-doctor role → remove all types
        updateData.attached_types = { deleteMany: {} };
      }
    }

    const updated_worker = await this.prisma.worker.update({
      where: {
        id: existing_worker.id,
      },
      data: updateData,
      include: {
        worker: true,
        attached_types: {
          include: {
            type: true,
          },
        },
      },
    });

    return updated_worker;
  }

  async deleteAWorker(
    req: RequestWithUser,
    params: { org_id: number; id: number },
  ) {
    const user = req.user;
    await this.prisma.worker.delete({
      where: {
        id: params.id,
        organization_id: params.org_id,
        organization: { owner_id: user.id },
      },
    });
    return { deleted: true };
  }
}

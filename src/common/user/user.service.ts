import { HttpException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(req: RequestWithUser, data: UpdateUserDTO) {
    const user = req.user;
    const updating = await this.prisma.user.update({
      where: { id: user.id },
      data: { ...data },
      include: {
        _count: {
          select: {
            organizations: true,
          },
        },
        default_organization: {
          include: {
            organization: {
              include: {
                banner: true,
              },
            },
          },
        },
      },
    });
    if (!updating) {
      throw new HttpException('Internal Server Error, try again later', 400);
    }
    return updating;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new HttpException('user not defined', 404);
    }
    return user;
  }

  async getMyWork(req: RequestWithUser) {
    const user = req.user;
    const work = await this.prisma.worker.findFirst({
      where: { worker_id: user.id },
      include: {
        organization: {
          include: {
            banner: true,
          },
        },
        worker: true,
      },
    });
    return work;
  }
}

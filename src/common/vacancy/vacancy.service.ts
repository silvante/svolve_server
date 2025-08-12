import { HttpException, Injectable } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VacancyService {
  constructor(private readonly prisma: PrismaService) {}
  async create(req: RequestWithUser, data: CreateVacancyDto) {
    const user = req.user;
    const new_vacancy = await this.prisma.vacancy.create({
      data: {
        ...data,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        user: true,
      },
    });
    if (!new_vacancy) {
      throw new HttpException('Internal server error', 404);
    }
    return new_vacancy;
  }

  async findMyAll(req: RequestWithUser) {
    const user = req.user;
    const vacancies = await this.prisma.vacancy.findMany({
      where: { user_id: user.id },
      include: {
        user: true,
      },
    });
    if (!vacancies) {
      throw new HttpException('Internal server error', 404);
    }
    return vacancies;
  }

  async findOne(id: number) {
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id: id },
      include: {
        user: true,
      },
    });
    if (!vacancy) {
      throw new HttpException('Vacancy not found', 404);
    }
    return vacancy;
  }

  async update(req: RequestWithUser, id: number, data: UpdateVacancyDto) {
    const user = req.user;
    const vacancy = await this.prisma.vacancy.update({
      where: { id: id, user_id: user.id },
      data: {
        ...data,
      },
      include: {
        user: true,
      },
    });
    if (!vacancy) {
      throw new HttpException(
        'Vacancy not found or You do not own this vacancy',
        404,
      );
    }
    return vacancy;
  }

  async remove(req: RequestWithUser, id: number) {
    const user = req.user;
    const deleting_obj = await this.prisma.vacancy.delete({
      where: { id: id, user_id: user.id },
    });
    if (!deleting_obj) {
      throw new HttpException(
        'Vacancy not found or You do not own this vacancy',
        404,
      );
    }
    return {
      deleted: true,
    };
  }

  async search(origin: string, query: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.vacancy.findMany({
        where: {
          origin: origin,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: true,
        },
      }),
      this.prisma.vacancy.count({
        where: {
          origin: origin,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total: total,
        page: page,
        last_page: Math.ceil(total / limit),
      },
    };
  }
}

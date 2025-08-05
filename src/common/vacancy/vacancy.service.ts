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
    });
    if (!new_vacancy) {
      throw new HttpException('Internal server error', 404);
    }
    return new_vacancy;
  }

  findAll() {
    return `This action returns all vacancy`;
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

  update(id: number, updateVacancyDto: UpdateVacancyDto) {
    return `This action updates a #${id} vacancy`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacancy`;
  }
}

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
    });
    if (!updating) {
      throw new HttpException('Internal Server Error, try again later', 400);
    }
    return updating;
  }
}

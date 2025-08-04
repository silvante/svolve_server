import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppJwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [PrismaModule, AppJwtModule],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}

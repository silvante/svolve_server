import { Module } from '@nestjs/common';
import { OrganisationsController } from './organisations.controller';
import { OrganisationsService } from './organisations.service';
import { GlobalModule } from 'src/global/global.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppJwtModule } from 'src/jwt/jwt.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { TypesModule } from './types/types.module';

@Module({
  imports: [PrismaModule, GlobalModule, AppJwtModule, JobsModule, TypesModule],
  controllers: [OrganisationsController],
  providers: [OrganisationsService],
})
export class OrganisationsModule {}

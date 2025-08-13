import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { GlobalModule } from 'src/global/global.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppJwtModule } from 'src/jwt/jwt.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { TypesModule } from './types/types.module';
import { ClientsModule } from './clients/clients.module';
import { WorkersModule } from './workers/workers.module';

@Module({
  imports: [PrismaModule, GlobalModule, AppJwtModule, JobsModule, TypesModule, ClientsModule, WorkersModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}

import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { AppJwtModule } from 'src/jwt/jwt.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [AppJwtModule, PrismaModule, JobsModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}

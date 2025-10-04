import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppJwtModule } from 'src/jwt/jwt.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { GlobalModule } from 'src/global/global.module';

@Module({
  imports: [PrismaModule, AppJwtModule, JobsModule, GlobalModule],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}

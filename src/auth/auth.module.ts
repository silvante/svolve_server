import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { GlobalModule } from 'src/global/global.module';
import { AppJwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [PrismaModule, JobsModule, AppJwtModule, GlobalModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

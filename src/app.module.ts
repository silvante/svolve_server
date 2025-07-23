import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AppJwtModule } from './jwt/jwt.module';
import { MailersModule } from './mailers/mailers.module';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global/global.module';
import { OrganisationsModule } from './common/organisations/organisations.module';
import { UploadsModule } from './common/uploads/uploads.module';

@Module({
  imports: [
    PrismaModule,
    AppJwtModule,
    MailersModule,
    JobsModule,
    AuthModule,
    GlobalModule,
    OrganisationsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

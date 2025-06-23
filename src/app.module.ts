import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AppJwtModule } from './jwt/jwt.module';
import { MailersModule } from './mailers/mailers.module';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    PrismaModule,
    AppJwtModule,
    MailersModule,
    JobsModule,
    AuthModule,
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

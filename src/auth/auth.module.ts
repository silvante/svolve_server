import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { GlobalModule } from 'src/global/global.module';
import { AppJwtModule } from 'src/jwt/jwt.module';
import { GithubStrategy } from './github.strategy';
import { GoogleStrategy } from './google.strategy';
import { MailersModule } from 'src/mailers/mailers.module';

@Module({
  imports: [
    PrismaModule,
    JobsModule,
    AppJwtModule,
    GlobalModule,
    MailersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, GoogleStrategy],
})
export class AuthModule {}

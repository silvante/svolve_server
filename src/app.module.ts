import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AppJwtModule } from './jwt/jwt.module';
import { MailersModule } from './mailers/mailers.module';

@Module({
  imports: [PrismaModule, AppJwtModule, MailersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { AppJwtModule } from 'src/jwt/jwt.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GlobalModule } from 'src/global/global.module';

@Module({
  imports: [AppJwtModule, PrismaModule, GlobalModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}

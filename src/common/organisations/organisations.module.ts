import { Module } from '@nestjs/common';
import { OrganisationsController } from './organisations.controller';
import { OrganisationsService } from './organisations.service';
import { GlobalModule } from 'src/global/global.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppJwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [PrismaModule, GlobalModule, AppJwtModule],
  controllers: [OrganisationsController],
  providers: [OrganisationsService],
})
export class OrganisationsModule {}

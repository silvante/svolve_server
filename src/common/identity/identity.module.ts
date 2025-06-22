import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { AppJwtModule } from 'src/jwt/jwt.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AppJwtModule],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}

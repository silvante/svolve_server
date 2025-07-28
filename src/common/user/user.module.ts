import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AppJwtModule } from 'src/jwt/jwt.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AppJwtModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

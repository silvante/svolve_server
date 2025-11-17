import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AppJwtModule } from 'src/jwt/jwt.module';

@Module({
  controllers: [AdminController, AppJwtModule],
  providers: [AdminService]
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AppJwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [AppJwtModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

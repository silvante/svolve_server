import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { ConfigModule } from '@nestjs/config';
import { AppJwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [ConfigModule, AppJwtModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}

import { Module } from '@nestjs/common';
import { GenerateUsernameService } from './generate_username/generate_username.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocialAuthResponceService } from './social_auth_responce/social_auth_responce.service';

@Module({
  imports: [PrismaModule],
  providers: [GenerateUsernameService, SocialAuthResponceService],
  exports: [GenerateUsernameService, SocialAuthResponceService],
})
export class GlobalModule {}

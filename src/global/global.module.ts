import { Module } from '@nestjs/common';
import { GenerateUsernameService } from './generate_username/generate_username.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocialAuthResponceService } from './social_auth_responce/social_auth_responce.service';
import { ResetTokenService } from './reset_token/reset_token.service';
import { AccessTokenService } from './access_token/access_token.service';
import { AppJwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [PrismaModule, AppJwtModule],
  providers: [
    GenerateUsernameService,
    SocialAuthResponceService,
    ResetTokenService,
    AccessTokenService,
  ],
  exports: [
    GenerateUsernameService,
    SocialAuthResponceService,
    ResetTokenService,
    AccessTokenService,
  ],
})
export class GlobalModule {}

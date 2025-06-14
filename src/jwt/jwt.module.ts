import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_public_jwt_secret_key',
      signOptions: { expiresIn: '48h' },
    }),
  ],
  exports: [JwtModule],
})
export class AppJwtModule {}
